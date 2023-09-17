const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Midellwares

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
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
