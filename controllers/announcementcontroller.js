const Message = require('../models/message');
const AppError = require('../utils/apperror');

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

    await message.populate('sender', 'name email role');

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
      .populate('sender', 'name email role');

    return res.status(200).json(messages);
  } catch (error) {
    return next(error);
  }
}

module.exports = { createAnnouncement, getAnnouncementHistory };