const mongoose = require("mongoose");
const Order = require("../order/order.model");
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);

/**
 * @desc    Payment with srtipe
 * @route   /api/v1/order/charge/create-order
 * @method  POST
 * @access  Private
 */

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { address, city, postalCode, totalPrice, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: [
          {
            field: "items",
            message: "Item field is required",
          },
        ],
      });
    }

    // Validate the presence and type of totalPrice
    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: [
          {
            field: "totalPrice",
            message:
              "Total price field is required and must be a positive number",
          },
        ],
      });
    }
    if (!postalCode) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: [
          {
            field: "postalCode",
            message: "Postalcode field is required",
          },
        ],
      });
    }
    if (!address) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: [
          {
            field: "address",
            message: "Address field is required",
          },
        ],
      });
    }

    if (!city) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: [
          {
            field: "city",
            message: "City field is required",
          },
        ],
      });
    }

    const orderItems = items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    }));

    const newOrderArray = await Order.create(
      [
        {
          user: req.user.id,
          items: orderItems,
          totalPrice: totalPrice,
          address: address,
          city: city,
          postalCode: postalCode,
          isPaid: false,
        },
      ],
      { session }
    );

    // Convert totalAmount to cents
    const totalAmountInCents = Math.round(totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: "usd",
      metadata: {
        order_id: newOrderArray._id,
      },
    });

    const newOrder = newOrderArray[0];

    // Update the isPaid field on newOrder
    newOrder.isPaid = true;
    
    // Save the changes
    await newOrder.save();

    await session.commitTransaction();
    session.endSession();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error)
  }
};


