const mongoose = require("mongoose");

// User Schema Definition

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    isVerified: {
      type: Boolean,
    },
    otp: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    role: {
      type: String,
    },
    hasEarnedBadge: { type: Boolean, default: false },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
