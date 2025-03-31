
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { authenticateUser } = require('../middleware/auth');

// Upload a single image
router.post('/image', authenticateUser, upload.single('image'), uploadController.uploadSingleImage);

// Upload multiple images
router.post('/images', authenticateUser, upload.array('images', 10), uploadController.uploadMultipleImages);

// Delete an image from Cloudinary
router.delete('/image/:public_id', authenticateUser, uploadController.deleteImage);

module.exports = router;
