const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'uploads/'); // or your uploads directory
  },
  filename: (req, file, next) => {
    next(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploader = multer({storage : storage});

module.exports = uploader;