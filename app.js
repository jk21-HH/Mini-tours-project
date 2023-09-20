const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Midellwares

// Set security http headers

app.use(helmet());

// Limit requsts from same API

const limiter = rateLimit({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requsets from this IP, please try in an hour',
});

app.use('/api', limiter);

app.use(morgan('dev'));

// Body parser, reading data from body into req.body - max payload size

app.use(express.json({ limit: '10kb' }));

// Data sanatization against NoSql query injection

app.use(mongoSanitize());

// Data sanatization against XSS

app.use(xss());

// Test middleware

app.use((req, res, next) => {
  console.log('Hi from middleware');
  req.requsetTime = new Date().toISOString();
  next();
});

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
