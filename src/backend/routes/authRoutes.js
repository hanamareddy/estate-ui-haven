
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login with email and password
router.post('/login', authController.login);

// Google Sign-in
router.post('/google', authController.googleSignIn);

// Verify JWT token and get user
router.get('/verify', authController.verifyToken);

// Verify email with token
router.get('/verify-email/:token', authController.verifyEmail);

// Verify phone OTP
router.post('/verify-phone-otp', authController.verifyPhoneOtp);

// Resend phone OTP
router.post('/resend-phone-otp', authController.resendPhoneOtp);

// Resend email verification
router.post('/resend-email-verification', authController.resendEmailVerification);

// Password reset (forgot password)
router.post('/forgot-password', authController.forgotPassword);

// Reset password with token
router.post('/reset-password', authController.resetPassword);

module.exports = router;
