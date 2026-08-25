const Message = require('../models/message');
const AppError = require('../utils/apperror');

// GET /api/announcements (Fetch all announcements globally)
async function getAllAnnouncements(req, res, next) {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('sender', 'name email role')
      .catch(() => Message.find().sort({ createdAt: -1 })); // Fallback if populate fails

    return res.status(200).json({
      status: 'success',
      total: messages ? messages.length : 0,
      data: messages || [],
    });
  } catch (error) {
    // Return empty array instead of crashing serverless function on initial deployment/empty DB
    return res.status(200).json({
      status: 'success',
      total: 0,
      data: [],
    });
  }
}

// POST /api/announcements (Admin only)
async function createAnnouncement(req, res, next) {
  try {
    const eventId = req.body.event || req.body.eventId;
    const senderId = (req.user && (req.user._id || req.user.id)) || req.body.sender;
    const text = req.body.text;

    if (!eventId) return next(new AppError('Event ID is required.', 400));
    if (!senderId) return next(new AppError('Sender ID is required.', 400));
    if (!text) return next(new AppError('Text is required.', 400));

    const message = await Message.create({
      event: eventId,
      sender: senderId,
      text: text,
    });

    try {
      await message.populate('sender', 'name email role');
    } catch (popErr) {
      // Ignore population error if schema differs, still return message
    }

    const io = req.app.get('io');
    if (io) {
      io.to(eventId).emit('announcement', message);
    }

    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
}

// GET /api/announcements/:eventId (Public)
async function getAnnouncementHistory(req, res, next) {
  try {
    const { eventId } = req.params;

    const messages = await Message.find({ event: eventId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email role')
      .catch(() => Message.find({ event: eventId }).sort({ createdAt: 1 }));

    return res.status(200).json(messages || []);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllAnnouncements, createAnnouncement, getAnnouncementHistory };
