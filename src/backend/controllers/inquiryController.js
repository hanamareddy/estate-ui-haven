
const PropertyInquiry = require('../models/PropertyInquiry');
const Property = require('../models/Property');
const User = require('../models/User');

// Create a new inquiry (with or without authentication)
const createInquiry = async (req, res) => {
  try {
    const { propertyId, message, contactDetails } = req.body;
    
    // Validate required fields
    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Property ID and message are required' });
    }
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Create inquiry object
    const inquiryData = {
      property: propertyId,
      message,
      status: 'pending'
    };
    
    // For authenticated users
    if (req.user) {
      inquiryData.user = req.user._id;
    } 
    // For non-authenticated users
    else if (contactDetails) {
      if (!contactDetails.name || !contactDetails.email) {
        return res.status(400).json({ message: 'Contact name and email are required for non-authenticated users' });
      }
      inquiryData.contactName = contactDetails.name;
      inquiryData.contactEmail = contactDetails.email;
      inquiryData.contactPhone = contactDetails.phone || '';
    } else {
      return res.status(400).json({ message: 'Authentication or contact details are required' });
    }
    
    // Create and save the inquiry
    const inquiry = new PropertyInquiry(inquiryData);
    await inquiry.save();
    
    res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry: {
        id: inquiry._id,
        property: inquiry.property,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Failed to send inquiry' });
  }
};

// Get all inquiries for the current user (buyer)
const getUserInquiries = async (req, res) => {
  try {
    // Find all inquiries where the user is the requester
    const inquiries = await PropertyInquiry.find({ user: req.user._id })
      .populate('property', 'title address price images')
      .sort({ createdAt: -1 });
    
    // Format response data
    const formattedInquiries = inquiries.map(inquiry => ({
      id: inquiry._id,
      propertyId: inquiry.property._id,
      propertyTitle: inquiry.property.title,
      propertyAddress: inquiry.property.address,
      propertyPrice: inquiry.property.price,
      propertyImage: inquiry.property.images && inquiry.property.images.length > 0 ? 
        inquiry.property.images[0].url : null,
      message: inquiry.message,
      sellerResponse: inquiry.sellerResponse,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt
    }));
    
    res.json(formattedInquiries);
    
  } catch (error) {
    console.error('Error getting user inquiries:', error);
    res.status(500).json({ message: 'Failed to retrieve inquiries' });
  }
};

// Get all inquiries for the current seller's properties
const getSellerInquiries = async (req, res) => {
  try {
    // Check if user is a seller
    if (!req.user.isseller) {
      return res.status(403).json({ message: 'Only sellers can access property inquiries' });
    }
    
    // Find all properties owned by this seller
    const sellerProperties = await Property.find({ sellerId: req.user._id }).select('_id');
    const propertyIds = sellerProperties.map(property => property._id);
    
    // Find all inquiries for these properties
    const inquiries = await PropertyInquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title address price images')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    // Format response data
    const formattedInquiries = inquiries.map(inquiry => ({
      id: inquiry._id,
      propertyId: inquiry.property._id,
      propertyTitle: inquiry.property.title,
      propertyAddress: inquiry.property.address,
      propertyPrice: inquiry.property.price,
      propertyImage: inquiry.property.images && inquiry.property.images.length > 0 ? 
        inquiry.property.images[0].url : null,
      message: inquiry.message,
      buyerInfo: inquiry.user ? {
        name: inquiry.user.name,
        email: inquiry.user.email,
        phone: inquiry.user.phone || 'Not provided'
      } : {
        name: inquiry.contactName,
        email: inquiry.contactEmail,
        phone: inquiry.contactPhone || 'Not provided'
      },
      sellerResponse: inquiry.sellerResponse,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt
    }));
    
    res.json(formattedInquiries);
    
  } catch (error) {
    console.error('Error getting seller inquiries:', error);
    res.status(500).json({ message: 'Failed to retrieve inquiries' });
  }
};

// Respond to an inquiry (for sellers)
const respondToInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({ message: 'Response message is required' });
    }
    
    // Find the inquiry
    const inquiry = await PropertyInquiry.findById(inquiryId).populate('property');
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    // Check if user is the seller of the property
    if (inquiry.property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to respond to this inquiry' });
    }
    
    // Update the inquiry
    inquiry.sellerResponse = response;
    inquiry.status = 'responded';
    inquiry.updatedAt = Date.now();
    await inquiry.save();
    
    res.json({
      message: 'Response sent successfully',
      inquiry: {
        id: inquiry._id,
        sellerResponse: inquiry.sellerResponse,
        status: inquiry.status,
        updatedAt: inquiry.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({ message: 'Failed to send response' });
  }
};

module.exports = {
  createInquiry,
  getUserInquiries,
  getSellerInquiries,
  respondToInquiry
};
