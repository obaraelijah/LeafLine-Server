const mongoose = require("mongoose");

// Custom ID generation function
function generateId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let customId = "";
  for (let i = 0; i < 8; i++) {
    customId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return customId;
}

// Order Schema Definition

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      default: "Card",
    },
    trackingNumber: {
      type: String,
      unique: true,
      default: () => `LLTN-${generateId()}`,
      indexed: true,
    },
    transactionId: {
      type: String,
      unique: true,
      default: () => generateId(),
      indexed: true,
    },
    delivereAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Middleware to generate custom transactionId
orderSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = generateId();
  }
  next();
});

// Middleware to generate custom trackingNumber
orderSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `LLTN-${generateId()}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
