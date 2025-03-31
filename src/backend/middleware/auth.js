
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate users
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticateUser };
