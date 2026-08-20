const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/apperror');
const asyncHandler = require('../utils/asynchandler');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // FIX: Defaulting to 'attendee' to match the schema enum ['attendee', 'admin']
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'attendee',
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    status: 'success',
    token,
  });
}); 
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body; // 1. Destructure role

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // 2. Allow req.body.role or default to 'attendee'
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'attendee', 
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});