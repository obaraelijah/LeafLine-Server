// Basic Lib Imports
import "dotenv/config";
import { createWriteStream } from 'fs';
import { join } from 'path';
import cors from 'cors';
import { urlencoded } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

// Database connection with mongoose
import connectDB from './config/db.js';
await connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(json());
app.use(cookieParser());
app.use(cors('*'));


app.use(
    morgan('common', {
      stream: createWriteStream(join(__dirname, '/logs/access.log'), {
        flags: 'a',
      }),
    })
  );
  app.use(
    urlencoded({
      extended: false,
    })
  );

  app.use('/', (req, res) => {
    res
      .status(200)
      .json({ statusCode: 200, success: true, message: 'Health OK' });
  });

export default app;