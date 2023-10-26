// Database Lib Import
const mongoose = require("mongoose");

// Mongo DB Database Connection
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
};

module.exports = connectDB;