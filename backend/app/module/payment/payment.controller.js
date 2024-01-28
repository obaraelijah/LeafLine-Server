const mongoose = require('mongoose');
const Order = require('../order/order.model');
const Book = require('../book/book.model');
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

/**
 * @desc    Payment with srtipe
 * @route   /api/v1/payment/charge/create-order
 * @method  POST
 * @access  Private
 */

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookId, quantity, shippingAddress, shippingPrice } = req.body;

    // Basic Validation
    if (!bookId) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'bookId',
            message: 'bookId field is required',
          },
        ],
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'quantity',
            message: 'Quantity must be a positive number',
          },
        ],
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'user',
            message: 'User must need to login',
          },
        ],
      });
    }

    if (typeof shippingPrice !== 'number' || shippingPrice < 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'shippingPrice',
            message: 'Shipping price must be a non-negative number',
          },
        ],
      });
    }

    const book = await Book.findById(bookId);
    if (!book || !book.price) {
      return null;
    }
    const pricePerBook = book.price;

    // Ensure quantity is a valid number
    if (isNaN(quantity) || quantity <= 0) {
      return null; // Handle invalid quantity
    }

    // Calculate subtotal
    const subTotal = pricePerBook * quantity;

    // Calculate total amount with shipping cost
    const totalPrice = subTotal + shippingPrice;

    const dataInsert = [
      {
        user: req.user.id,
        bookId,
        quantity,
        subTotal,
        totalPrice,
        shippingAddress,
        shippingPrice,
      },
    ];
    // Create the order
    const newOrder = await Order.create(dataInsert, { session });

    // Stripe Payment Intent
    const totalAmountInCents = Math.round(totalPrice * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd',
      metadata: {
        company: 'LeafLine',
        order_id: newOrder._id,
      },
    });

    const updateFields = newOrder[0];

    // Update the isPaid field on newOrder
    updateFields.isPaid = true;
    updateFields.paidAt = Date.now();

    // Save the changes
    await updateFields.save();

    await session.commitTransaction();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};