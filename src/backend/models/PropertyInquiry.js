
const mongoose = require('mongoose');

const PropertyInquirySchema = new mongoose.Schema({
  // Reference to user (if authenticated)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      // Required only if no contactEmail is provided (for non-authenticated users)
      return !this.contactEmail;
    }
  },
  // Reference to property
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  // For non-authenticated users who are interested
  contactName: {
    type: String,
    required: function() {
      return !this.user;
    }
  },
  contactEmail: {
    type: String,
    required: function() {
      return !this.user;
    }
  },
  contactPhone: {
    type: String
  },
  // Message from the interested person
  message: {
    type: String,
    default: ''
  },
  // Response from the seller
  sellerResponse: {
    type: String,
    default: null
  },
  // Status of the inquiry: pending, responded, closed
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
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

// Update updatedAt on save
PropertyInquirySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PropertyInquiry', PropertyInquirySchema);
