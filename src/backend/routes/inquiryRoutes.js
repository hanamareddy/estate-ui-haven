
const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticateUser } = require('../middleware/auth');

// Create a new inquiry (authentication optional)
router.post('/', inquiryController.createInquiry);

// Get all inquiries for the current user
router.get('/user', authenticateUser, inquiryController.getUserInquiries);

// Get all inquiries for the current seller's properties
router.get('/seller', authenticateUser, inquiryController.getSellerInquiries);

// Respond to an inquiry (for sellers)
router.post('/:inquiryId/respond', authenticateUser, inquiryController.respondToInquiry);

module.exports = router;
