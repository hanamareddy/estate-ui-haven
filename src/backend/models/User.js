
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Not required for OAuth users
    },
    phone: {
      type: String,
      // Make phone optional initially for Google sign-in users
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isseller: {
      type: Boolean,
      default: false,
    },
    companyName: {
      type: String,
      default: '',
    },
    reraId: {
      type: String,
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneOtp: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    googleId: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    savedSearches: [
      {
        name: String,
        filters: Schema.Types.Mixed,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
