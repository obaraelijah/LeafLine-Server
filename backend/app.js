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
const { errorHandler, notFound } = require('./app/middleware/errorMiddleware');

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


app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
      flags: 'a',
    }),
  })
);

 app.use(express.urlencoded(
      { extended: true }
  ));

  app.use('/', (req, res) => {
    res
      .status(200)
      .json({ statusCode: 200, success: true, message: 'Health OK' });
  });
  
  //custom middleware
  app.use(notFound);
  app.use(errorHandler);

  module.exports = app;
