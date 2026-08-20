const express = require('express');
const router = express.Router();

// Importing from evencontroller.js to match your file name
const eventController = require('../controllers/evencontroller');
const requireAuth = require('../middleware/requireauth');
const requireRole = require('../middleware/requirerole');

// Public endpoints
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin-only endpoints
router.post('/', requireAuth, requireRole('admin'), eventController.createEvent);
router.patch('/:id', requireAuth, requireRole('admin'), eventController.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), eventController.deleteEvent);

module.exports = router;