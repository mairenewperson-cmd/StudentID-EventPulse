const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireauth'); // Your auth middleware
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require('../controllers/registrationcontroller');

// All endpoints require authentication
router.post('/', requireAuth, registerForEvent);
router.get('/my', requireAuth, getMyRegistrations);
router.delete('/:id', requireAuth, cancelRegistration);

module.exports = router;