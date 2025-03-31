
const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'EstateHub India - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5;">EstateHub India</h1>
            <p style="font-size: 18px; color: #333;">Verify Your Email Address</p>
          </div>
          
          <div style="margin-bottom: 30px; color: #555;">
            <p>Thank you for registering with EstateHub India, your trusted platform for Indian real estate.</p>
            <p>Please click the button below to verify your email address and activate your account:</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          
          <div style="margin-bottom: 20px; color: #555;">
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>This link will expire in 24 hours. If you did not create an account with EstateHub India, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} EstateHub India. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'EstateHub India - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5;">EstateHub India</h1>
            <p style="font-size: 18px; color: #333;">Reset Your Password</p>
          </div>
          
          <div style="margin-bottom: 30px; color: #555;">
            <p>You have requested to reset your password for your EstateHub India account.</p>
            <p>Please click the button below to reset your password:</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <div style="margin-bottom: 20px; color: #555;">
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${resetUrl}</p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} EstateHub India. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
