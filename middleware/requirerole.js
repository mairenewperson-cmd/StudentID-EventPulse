const AppError = require('../utils/apperror');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You must be logged in to perform this action', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}

module.exports = requireRole;