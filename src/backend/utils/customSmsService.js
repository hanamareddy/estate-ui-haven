
const nodemailer = require('nodemailer');

/**
 * Send SMS via email-to-SMS gateways
 * This approach uses email-to-SMS gateways provided by major carriers
 * Example: For a Vodafone number 9876543210, send to 9876543210@vodafone.in
 * 
 * NOTE: This is a cost-effective alternative to paid SMS gateways
 */
const sendSMS = async (phoneNumber, message) => {
  try {
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
      throw error; // Throw the original error
    }
  }
};

module.exports = { sendSMS };
