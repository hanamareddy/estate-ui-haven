
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/customSmsService');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      isseller: user.isseller || false 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, isseller, companyName, reraId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate verification tokens
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      isseller: isseller || false,
      emailVerificationToken,
      phoneOtp,
      companyName: isseller ? companyName : '',
      reraId: isseller ? reraId : '',
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, emailVerificationToken);
    
    // Send OTP to phone
    const otpMessage = `Your EstateHub India verification code is: ${phoneOtp}`;
    await sendSMS(phone, otpMessage);

    res.status(201).json({ 
      message: 'Registration successful. Please verify your phone number and email.',
      phoneVerificationRequired: true, 
      email 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login with email and password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For login, we'll allow login even if phone/email isn't verified
    // But we'll send a flag to inform the frontend about verification status
    const verificationStatus = {
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified
    };

    // Generate token regardless of verification status
    const token = generateToken(user);

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Return user data with token and verification status
    res.status(200).json({
      token,
      verificationStatus,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isseller: user.isseller,
        companyName: user.companyName,
        reraId: user.reraId,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google Sign-in
exports.googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify the token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a new user
      user = new User({
        name,
        email,
        googleId,
        profilePicture: picture,
        emailVerified: true, // Google already verified email
      });
      
      await user.save();
      
      // Since we're bypassing verification for login, we'll do the same for Google sign-in
      // Just inform the user they need to complete their profile
      const token = generateToken(user);
      
      return res.status(200).json({
        token,
        message: 'Google sign-in successful. Please complete your profile.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          phone: user.phone,
          isseller: user.isseller || false,
        },
        verificationStatus: {
          phoneVerified: false,
          emailVerified: true
        }
      });
    }
    
    // Update Google ID if not set
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Return user with token and verification status
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isseller: user.isseller,
        companyName: user.companyName,
        reraId: user.reraId,
        profilePicture: user.profilePicture || picture,
      },
      verificationStatus: {
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// Verify JWT token and get user
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -phoneOtp -emailVerificationToken');
    res.json(user);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email with token
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    
    // Generate token
    const authToken = generateToken(user);
    
    return res.status(200).json({
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isseller: user.isseller,
        companyName: user.companyName,
        reraId: user.reraId,
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify phone OTP
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check OTP
    if (user.phoneOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    user.phoneVerified = true;
    user.phoneOtp = undefined;
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    res.status(200).json({
      message: 'Phone verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isseller: user.isseller,
        companyName: user.companyName,
        reraId: user.reraId,
      }
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend phone OTP
exports.resendPhoneOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new OTP
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneOtp = phoneOtp;
    await user.save();
    
    // Send OTP to phone
    const otpMessage = `Your EstateHub India verification code is: ${phoneOtp}`;
    await sendSMS(user.phone, otpMessage);
    
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend email verification
exports.resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();
    
    // Send verification email
    await sendVerificationEmail(email, emailVerificationToken);
    
    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);
    
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({ 
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
