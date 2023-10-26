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
const { createWriteStream } = require('fs');
const { join } = require('path');

const app = express();

// Database connection with mongoose
const connectDB = require('./config/db'); 
connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(cors('*'));




 app.use(express.urlencoded(
      { extended: true }
  ));

  app.use('/', (req, res) => {
    res
      .status(200)
      .json({ statusCode: 200, success: true, message: 'Health OK' });
  });

  module.exports = app;
