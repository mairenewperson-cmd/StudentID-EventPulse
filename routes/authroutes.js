const express = require('express');
const { register, login } = require('../controllers/authcontroller');
const requireAuth = require('../middleware/requireauth'); // Make sure path matches your auth middleware file
const requireRole = require('../middleware/requirerole'); // Make sure path matches your role middleware file

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (Test 3 & Test 4)
router.get('/protected', requireAuth, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Access granted! You passed the requireAuth middleware.',
  });
});

// Admin-only route (Test requireRole)
router.get('/admin-only', requireAuth, requireRole('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Access granted! You are an admin.',
  });
});

module.exports = router;