const AppError = require('./../utilis/appError');

// Handle Database Error
const handleCaseErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, 400);
};

// Handle Duplicate fields errors
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field with  ${value} . Please use another value`;

  return new AppError(message, 400);
};

// Handler validation database error
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

// Handler JWT Error
const handleJWTError = () =>
  new AppError('Invalid Token, Please log in again', 401);

// Handle Send developer error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Handle token expired Error
const handleJWTExpired = () => new AppError('Your token has expired, pleae login again')

// Hanlde send production error 
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // 1) Log error to console
    console.error('Error', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'err';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CaseError') error = handleCaseErrorDB(error);
    sendErrorProd(error, res);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'validationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(error.name === 'TokenExpiredError') error = handleJWTExpired(error);
  }
};
