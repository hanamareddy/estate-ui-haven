
const User = require('../models/User');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-googleId -password -emailVerificationToken -emailVerificationExpires -phoneOtp -phoneOtpExpires -passwordResetToken -passwordResetExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Only allow certain fields to be updated
    const { name, phone, companyName, reraId } = req.body;
    
    const updateData = {
      updated_at: Date.now(),
    };
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (reraId !== undefined) updateData.reraId = reraId;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-googleId -password -emailVerificationToken -emailVerificationExpires -phoneOtp -phoneOtpExpires -passwordResetToken -passwordResetExpires');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's favorite properties
const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const favoriteProperties = await Property.find({
      _id: { $in: user.favorites }
    });
    
    res.json(favoriteProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add property to favorites
const addPropertyToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if already in favorites
    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }
    
    // Add to favorites
    user.favorites.push(propertyId);
    await user.save();
    
    res.json({ message: 'Property added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove property from favorites
const removePropertyFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    await user.save();
    
    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if a property is in user's favorites
const checkPropertyInFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);
    
    const isFavorite = user.favorites.some(id => id.toString() === propertyId);
    res.json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      user_id: req.user._id 
    }).sort({ created_at: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user_id: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserFavorites,
  addPropertyToFavorites,
  removePropertyFromFavorites,
  checkPropertyInFavorites,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
