
const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');

// Get all properties with optional filtering
const getAllProperties = async (req, res) => {
  try {
    const filter = {};
    
    // Apply filters from query parameters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
    if (req.query.state) filter.state = new RegExp(req.query.state, 'i');
    if (req.query.minPrice) filter.price = { $gte: parseInt(req.query.minPrice) };
    if (req.query.maxPrice) {
      filter.price = filter.price || {};
      filter.price.$lte = parseInt(req.query.maxPrice);
    }
    if (req.query.bedrooms) filter.bedrooms = parseInt(req.query.bedrooms);
    if (req.query.amenities) {
      const amenitiesList = Array.isArray(req.query.amenities) 
        ? req.query.amenities 
        : [req.query.amenities];
      filter.amenities = { $all: amenitiesList };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    // Execute query with pagination and sorting
    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Property.countDocuments(filter);
    
    res.json({
      properties,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    
    // Add seller information from authenticated user
    const newProperty = new Property({
      ...propertyData,
      sellerId: req.user._id,
      sellerEmail: req.user.email,
      sellerContact: propertyData.sellerContact || req.user.phone || ''
    });
    
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if user is the property owner
    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this property' });
    }
    
    // Handle removed images if any
    if (req.body.removedImages && req.body.removedImages.length > 0) {
      // Delete images from Cloudinary
      const deletePromises = req.body.removedImages.map(publicId => 
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.all(deletePromises);
      
      // Remove from property
      property.images = property.images.filter(img => 
        !req.body.removedImages.includes(img.public_id)
      );
    }
    
    // Update property data
    const updatedData = { ...req.body, updatedAt: Date.now() };
    delete updatedData.removedImages; // Remove this field as it's not part of the model
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if user is the property owner
    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this property' });
    }
    
    // Delete all property images from Cloudinary
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
    }
    
    // Delete the property
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get properties for specific seller
const getPropertyBySellerId = async (req, res) => {
  try {
    const properties = await Property.find({ sellerId: req.params.sellerId });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching seller properties:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get properties by current authenticated seller
const getSellerProperties = async (req, res) => {
  try {
    // Check if user is a seller
    if (!req.user.isseller) {
      return res.status(403).json({ message: 'Only sellers can access their properties' });
    }
    
    const properties = await Property.find({ sellerId: req.user._id });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBySellerId,
  getSellerProperties
};
