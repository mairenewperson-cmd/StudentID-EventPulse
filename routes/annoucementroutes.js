const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const requireAuth = require('../middleware/requireauth');
const requireRole = require('../middleware/requirerole');
const {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementHistory,
} = require('../controllers/announcementcontroller');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateCreateAnnouncement = [
  body('text')
    .notEmpty()
    .withMessage('Announcement text is required')
    .isString()
    .withMessage('Text must be a string')
    .trim(),
  handleValidation,
];

const validateGetHistory = [
  param('eventId')
    .isMongoId()
    .withMessage('Invalid MongoDB ObjectId format for eventId'),
  handleValidation,
];

// GET /api/announcements (Fetch all announcements)
router.get('/', getAllAnnouncements);

// POST /api/announcements (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validateCreateAnnouncement,
  createAnnouncement
);

// GET /api/announcements/:eventId (Public history by event)
router.get('/:eventId', validateGetHistory, getAnnouncementHistory);

module.exports = router;
