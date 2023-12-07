// Basic Lib Imports
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./app/middleware/errorMiddleware');


const applicationRoutes = require('./app/routes/index');

// Database connection with mongoose
const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors('*'));

// // Define an array of allowed origins
// const allowedOrigins = [
//   `http://localhost:5173`,
//   `https://leafline-admin.vercel.app/`,
//   `https://leafline.vercel.app/`,
//   // Add more domains as needed
// ];

// // Configure CORS with the allowed origins
// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is in the list of allowed origins or if it's undefined (for same-origin requests)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS')); // Deny the request
//     }
//   },
//   credentials: true,
// }));

app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
      flags: 'a',
    }),
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use('/api/v1/', applicationRoutes);
app.use('/', (req, res) => {
  res
    .status(200)
    .json({ statusCode: 200, success: true, message: 'Health OK' });
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;