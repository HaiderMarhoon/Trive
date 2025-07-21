const multer = require('multer');
const cloudinary = require('./cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Trive',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
module.exports = multer({storage:storage})