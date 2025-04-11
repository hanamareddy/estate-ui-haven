
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
    required: true,
    min: [1, 'Price must be greater than 0']
  },
  type: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'PG/Co-living', 'Builder Floor', 'Farmhouse', 'Land']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  sqft: {
    type: Number,
    required: true,
    min: [1, 'Square footage must be greater than 0'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: props => `${props.value} is not a valid square footage. Must be greater than 0.`
    }
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

// Add a custom validation for sqft before saving
PropertySchema.pre('save', function(next) {
  // Convert string to number if needed
  if (typeof this.sqft === 'string') {
    this.sqft = Number(this.sqft);
  }
  
  // Validate sqft is a number and greater than 0
  if (isNaN(this.sqft) || this.sqft <= 0) {
    return next(new Error('Square footage must be a valid number greater than 0'));
  }
  
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
