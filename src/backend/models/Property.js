
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'PG/Co-living', 'Builder Floor', 'Farmhouse', 'Land']
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  sqft: {
    type: Number,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'sold', 'rented'],
    default: 'pending'
  },
  propertyStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction', 'Resale'],
    default: 'Ready to Move'
  },
  description: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    lowercase: true
  },
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  pincode: {
    type: String,
    required: true
  },
  furnished: {
    type: String,
    enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
    default: 'Unfurnished'
  },
  constructionYear: {
    type: String,
    required: false
  },
  amenities: {
    type: [String],
    default: []
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerContact: {
    type: String,
    required: true
  },
  sellerEmail: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt value before saving
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
