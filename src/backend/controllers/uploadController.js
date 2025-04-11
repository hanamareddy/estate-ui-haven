const cloudinary = require('../config/cloudinary');

// Upload a single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: 'estateHub/properties',
        use_filename: true,
        unique_filename: true,
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      stream.end(req.file.buffer);
    });

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
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: 'estateHub/properties',
          use_filename: true,
          unique_filename: true,
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

        stream.end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

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
