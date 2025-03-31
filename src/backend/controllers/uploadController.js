
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Upload a single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'estateHub/properties',
      use_filename: true,
      unique_filename: true,
    });

    // Delete the local file after upload
    fs.unlinkSync(req.file.path);

    // Return the Cloudinary URL
    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Error uploading image', error: error.message });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'estateHub/properties',
        use_filename: true,
        unique_filename: true,
      })
    );

    // Upload all files to Cloudinary
    const results = await Promise.all(uploadPromises);

    // Delete all local files after upload
    req.files.forEach(file => fs.unlinkSync(file.path));

    // Return array of Cloudinary URLs
    const imageUrls = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));

    res.status(200).json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Error uploading images', error: error.message });
  }
};

// Delete an image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Error deleting image', error: error.message });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
};
