const mongoose = require('mongoose');
const { generateOrderId } = require('../../../helper/generateOrderId');

// Order Schema Definition
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: false,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: false,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      subTotal: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Processing',
  },
  trackingNumber: {
    type: String,
    require: true,
    index: true,
    unique: true,
    sparse: true,
  },
  discountAmount: { type: Number, required: false },
  subTotal: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = generateOrderId();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;