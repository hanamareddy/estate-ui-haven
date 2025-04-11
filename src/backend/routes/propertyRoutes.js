
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateUser } = require('../middleware/auth');

// Get all properties with optional filtering
router.get('/', propertyController.getAllProperties);

// Get a specific property by ID
router.get('/:id', propertyController.getPropertyById);

// Create a new property (requires authentication)
router.post('/', authenticateUser, propertyController.createProperty);

// Update a property (only by the owner)
router.put('/:id', authenticateUser, propertyController.updateProperty);

// Delete a property (only by the owner)
router.delete('/:id', authenticateUser, propertyController.deleteProperty);

// Get properties for specific seller
router.get('/seller/:sellerId', propertyController.getPropertyBySellerId);

// Get properties by current authenticated seller
router.get('/myseller/properties', authenticateUser, propertyController.getSellerProperties);

// Get analytics data
router.get('/analytics', authenticateUser, propertyController.getAnalytics);

module.exports = router;
