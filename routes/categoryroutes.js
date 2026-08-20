const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categorycontroller');

router.post('/', createCategory);
router.get('/', getCategories);

module.exports = router;