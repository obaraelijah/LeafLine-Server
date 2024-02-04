const mongoose = require('mongoose');
const Order = require('../order/order.model');
const Book = require('../book/book.model');
const { sendResponse } = require('../../../services/responseService');
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
    const { books, shippingAddress } = req.body;

    // Basic Validation
    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error: Books array is required and must not be empty',
      });
    }

    // Validate each book item and calculate totals
    let totalPrice = 0;
    let totalSubTotal = 0;
    for (const bookItem of books) {
      const book = await Book.findById(bookItem.bookId);
      if (!book || !book.price) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Book not found or price is invalid',
        });
      }

      if (!bookItem.quantity || bookItem.quantity <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid quantity for one or more books',
        });
      }

      const shippingFees = book.shippingFees || 0;
      const subTotal = book.price * bookItem.quantity;
      if (isNaN(subTotal)) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Subtotal calculation error for one or more books',
        });
      }

      bookItem.subTotal = subTotal;
      totalSubTotal += subTotal;
      totalPrice += subTotal + shippingFees;
    }

    const dataInsert = [
      {
        user: req.user.id,
        books: books.map(bookItem => ({
          bookId: bookItem.bookId,
          quantity: bookItem.quantity,
          subTotal: bookItem.subTotal,
        })),
        subTotal: totalSubTotal,
        totalPrice,
        shippingAddress,
      },
    ];

    const newOrder = await Order.create(dataInsert, { session });

    const totalAmountInCents = Math.round(totalPrice * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd',
      metadata: {
        company: 'LeafLine',
        order_id: newOrder._id,
      },
    });

    await session.commitTransaction();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Confirm Payment with srtipe
 * @route   /api/v1/payment/confirm
 * @method  POST
 * @access  Private
 */

// exports.confirmStripePayment = async (req, res) => {
//   try {
//     // Extract data from request
//     const { orderId, paymentMethod, clientSecret } = req.body;
//     const userId = req.user.id;

//     // Validate orderId, paymentMethod, and clientSecret
//     if (!orderId || !paymentMethod || !clientSecret) {
//       return sendResponse(res, 400, false, 'Missing required fields');
//     }

//     // Find the user's order by user ID
//     const userOrder = await Order.findOne({ user: userId });

//     if (!userOrder) {
//       return sendResponse(res, 404, false, 'User did not place any orders');
//     }

//     // Find the specific order in the user's order list
//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return sendResponse(res, 404, false, 'Order not found');
//     }

//     // Confirm the payment using the client secret and payment method
//     const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
//       payment_method: paymentMethod,
//     });

//     if (paymentIntent.status === 'succeeded') {
//       // Update the payment status of the order to true
//       order.isPaid = true;
//       order.paidAt = Date.now();

//       // Save the changes
//       await order.save();

//       return sendResponse(res, 200, true, 'Payment successful');
//     } else {
//       return sendResponse(res, 400, false, 'Payment failed');
//     }
//   } catch (error) {
//     console.error('Error making payment:', error);
//     return sendResponse(res, 500, false, 'Error making payment');
//   }
// };