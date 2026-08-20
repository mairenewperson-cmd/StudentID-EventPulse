const Event = require('../models/event');
const Category = require('../models/category'); 
const AppError = require('../utils/apperror');
const User = require('../models/user');
const asyncHandler = require('../utils/asynchandler');

// 1. GET ALL EVENTS (Filtering, Pagination, Sorting, Search)
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, page, limit, sortBy, order, search } = req.query;

  // Filter building
  const filter = {};
  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Text search
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Safe sorting
  const allowedSortFields = ['date', 'registrations'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;
  const sort = { [sortField]: sortDirection };

  // Database Execution
  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate('category')
      .populate('organizer', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Event.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data
  });
});

// 2. GET EVENT BY ID
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', 'name email');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

// 3. CREATE EVENT
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user.userId || req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: event
  });
});

// 4. UPDATE EVENT
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

// 5. DELETE EVENT
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null
  });
});