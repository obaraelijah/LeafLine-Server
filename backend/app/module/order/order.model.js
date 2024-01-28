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
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  shippingAddress: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
  },
  shippingPrice: { type: Number, required: false },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Processing',
  },
  trackingNumber: { type: String, required: false },
  discountAmount: { type: Number, required: false },
  subTotal: { type: Number, required: false },
  totalPrice: { type: Number, required: false },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});


orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = generateOrderId();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;