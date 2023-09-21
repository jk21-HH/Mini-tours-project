const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Midllewares

// Implement CORS - Access-Controll-Allow-Origin: *

app.use(cors());

// Allow pre flight faze - allow complex requests

app.options('*', cors());

// Set security http headers

app.use(helmet());

// Limit requsts from same API

const limiter = rateLimit({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requsets from this IP, please try in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body - max payload size

app.use(express.json({ limit: '10kb' }));

// Data sanatization against NoSql query injection

app.use(mongoSanitize());

// Data sanatization against XSS

app.use(xss());

// Prevent parameter polution (same filed twice or more)

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware

app.use((req, res, next) => {
  console.log('Hi from middleware');
  req.requsetTime = new Date().toISOString();
  next();
});

// HTTP request logger middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The route entered: ${req.originalUrl} is not correct on this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
