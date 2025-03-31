
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

// Get current user profile
router.get('/profile', authenticateUser, userController.getUserProfile);

// Update user profile
router.put('/profile', authenticateUser, userController.updateUserProfile);

// Get user's favorite properties
router.get('/favorites', authenticateUser, userController.getUserFavorites);

// Add property to favorites
router.post('/favorites/:propertyId', authenticateUser, userController.addPropertyToFavorites);

// Remove property from favorites
router.delete('/favorites/:propertyId', authenticateUser, userController.removePropertyFromFavorites);

// Check if a property is in user's favorites
router.get('/favorites/check/:propertyId', authenticateUser, userController.checkPropertyInFavorites);

// Get user's notifications
router.get('/notifications', authenticateUser, userController.getUserNotifications);

// Mark notification as read
router.put('/notifications/:notificationId/read', authenticateUser, userController.markNotificationAsRead);

// Mark all notifications as read
router.put('/notifications/read-all', authenticateUser, userController.markAllNotificationsAsRead);

module.exports = router;
