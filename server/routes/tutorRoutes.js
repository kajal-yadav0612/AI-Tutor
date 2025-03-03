const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/tutorController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Tutor API is working!' });
});

// Main tutor endpoint
router.post('/generate-response', generateResponse);

module.exports = router;