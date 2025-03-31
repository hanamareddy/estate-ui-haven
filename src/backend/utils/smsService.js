
const nodemailer = require('nodemailer');

/**
 * Custom SMS service that uses email to SMS gateways 
 * This is a cost-effective alternative to Twilio
 * Most Indian telecom operators provide email to SMS gateways
 */
const smsService = {
  // Map of Indian mobile carrier domains
  carrierDomains: {
    // Add the email-to-SMS gateway domains for major Indian carriers
    'airtel': 'airtel.in',
    'jio': 'jiomail.com',
    'vodafoneIdea': 'vimail.in',
    'bsnl': 'bsnl.in',
    'default': 'sms.carrier.com' // Fallback domain
  },

  // Configure email transporter for SMS delivery
  transporter: nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }),

  /**
   * Detect carrier from phone number prefix (simplified logic)
   * In a production environment, you would use a more comprehensive database
   * of number prefixes to accurately determine the carrier
   */
  detectCarrier: (phoneNumber) => {
    // Strip any non-digit characters and remove country code if present
    const normalizedNumber = phoneNumber.replace(/\D/g, '').replace(/^91/, '');
    
    // Basic prefix detection for major Indian carriers
    // This is simplified logic - would need more comprehensive mapping in production
    if (normalizedNumber.startsWith('9810') || normalizedNumber.startsWith('9811')) {
      return 'airtel';
    } else if (normalizedNumber.startsWith('9870') || normalizedNumber.startsWith('9871')) {
      return 'jio';
    } else if (normalizedNumber.startsWith('9890') || normalizedNumber.startsWith('9891')) {
      return 'vodafoneIdea';
    } else if (normalizedNumber.startsWith('9840') || normalizedNumber.startsWith('9841')) {
      return 'bsnl';
    }
    
    return 'default';
  },

  /**
   * Send SMS via email to SMS gateway
   */
  sendSMS: async (phoneNumber, message) => {
    try {
      // Format phone for email to SMS gateway
      const carrier = smsService.detectCarrier(phoneNumber);
      const carrierDomain = smsService.carrierDomains[carrier];
      
      // Strip any non-digit characters
      const digits = phoneNumber.replace(/\D/g, '');
      
      // Create email-to-SMS address
      const smsEmail = `${digits}@${carrierDomain}`;
      
      // Send the message
      await smsService.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: smsEmail,
        subject: '', // Most SMS gateways ignore the subject
        text: message.substring(0, 160) // Limit to 160 characters for standard SMS
      });
      
      console.log(`SMS sent to ${phoneNumber} via ${carrier} gateway`);
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      
      // Fallback to direct email if SMS gateway fails
      if (process.env.SMS_FALLBACK_TO_EMAIL === 'true') {
        try {
          // Check if we have the user's email (this requires having email in the context)
          if (phoneNumber.userEmail) {
            await smsService.transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: phoneNumber.userEmail,
              subject: 'Your verification code',
              text: message
            });
            console.log(`Fallback: Email sent to ${phoneNumber.userEmail}`);
            return true;
          }
        } catch (fallbackError) {
          console.error('Fallback email sending failed:', fallbackError);
        }
      }
      
      return false;
    }
  },

  /**
   * Send OTP via custom SMS service
   */
  sendOTP: async (phoneNumber, otp, userEmail = null) => {
    // Add email for fallback if available
    if (userEmail) {
      phoneNumber.userEmail = userEmail;
    }
    
    const message = `Your EstateHub India verification code is: ${otp}. Valid for 10 minutes.`;
    return await smsService.sendSMS(phoneNumber, message);
  },
  
  /**
   * Send password reset link via custom SMS service
   */
  sendPasswordResetLink: async (phoneNumber, resetLink, userEmail = null) => {
    // Add email for fallback if available
    if (userEmail) {
      phoneNumber.userEmail = userEmail;
    }
    
    const message = `Reset your EstateHub India password using this link: ${resetLink}`;
    return await smsService.sendSMS(phoneNumber, message);
  }
};

module.exports = smsService;
