
const nodemailer = require('nodemailer');

/**
 * Send SMS via email-to-SMS gateways or mock in development
 */
const sendSMS = async (phoneNumber, message) => {
  try {
    // Development mode - just log the message and return success
    if (process.env.NODE_ENV !== 'production') {
      console.log('\x1b[33m%s\x1b[0m', '--- DEVELOPMENT MODE: SMS MESSAGE ---');
      console.log('\x1b[33m%s\x1b[0m', `To: ${phoneNumber}`);
      console.log('\x1b[33m%s\x1b[0m', `Message: ${message}`);
      console.log('\x1b[33m%s\x1b[0m', '------------------------------------');
      return true;
    }
    
    // Only try to send real SMS in production
    // Remove any non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Extract country code and number
    // For Indian numbers typically +91XXXXXXXXXX
    const isIndianNumber = phoneNumber.includes('+91') || phoneNumber.startsWith('91');
    const last10Digits = cleanPhone.slice(-10);
    
    // Create list of SMS gateways to try (for major Indian carriers)
    const smsGateways = [
      `${last10Digits}@airtel.in`,  // Airtel
      `${last10Digits}@sms.vodafone.in`, // Vodafone
      `${last10Digits}@ideacellular.net`, // Idea
      `${last10Digits}@jiomail.com`, // Jio
      `${last10Digits}@bsnl.in`, // BSNL
    ];
    
    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Send to all gateways (at least one should work)
    const sendPromises = smsGateways.map(gatewayEmail => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: gatewayEmail,
        subject: 'EstateHub India',
        text: message,
      };
      
      return transporter.sendMail(mailOptions);
    });
    
    // Wait for all attempts
    await Promise.all(sendPromises);
    
    console.log(`SMS sent to ${phoneNumber} via email-to-SMS gateway`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    
    // In development, we'll consider this a success anyway
    if (process.env.NODE_ENV !== 'production') {
      console.log('\x1b[33m%s\x1b[0m', '--- DEVELOPMENT MODE: SMS DELIVERY FALLBACK ---');
      console.log('\x1b[33m%s\x1b[0m', `Would have sent to: ${phoneNumber}`);
      console.log('\x1b[33m%s\x1b[0m', `Message: ${message}`);
      console.log('\x1b[33m%s\x1b[0m', '--------------------------------------------');
      return true;
    }
    
    // Fallback: Just send an email if we can't use SMS gateway
    try {
      // Extract email from user phone (if it's an email)
      const isEmail = phoneNumber.includes('@');
      const email = isEmail ? phoneNumber : null;
      
      // If we have an email, send the OTP directly via email
      if (email) {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'EstateHub India Verification Code',
          text: message,
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Fallback: Verification code sent via email to ${email}`);
        return true;
      }
      
      throw new Error('No valid email or phone for sending verification code');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      // In development, show what would have been sent
      if (process.env.NODE_ENV !== 'production') {
        return true;
      }
      
      throw error; // Throw the original error in production
    }
  }
};

module.exports = { sendSMS };
