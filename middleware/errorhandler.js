function errorHandler(err, req, res, next) {
  // Temporary debug line to print the exact stack trace in Jest terminal output
  console.error('--- ERROR DEBUG ---', err);

  // 1. Capture statusCode from err.statusCode OR err.status, defaulting to 500
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Something went wrong';

  // 2. Mongoose Validation Error (e.g., required fields missing in model)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // 3. Mongoose Cast Error (e.g., invalid ObjectId in URL parameters)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // 4. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value. This record already exists.';
  }

  // 5. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  // 6. Send formatted response
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;