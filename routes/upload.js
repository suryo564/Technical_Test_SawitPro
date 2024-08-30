const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filtering configuration
const fileFilter = (req, file, cb) => {
  const allowedExtensions = process.env.ALLOWED_EXTENSIONS.split(',');
  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedExtensions.includes(extname)) {
    return cb(null, true);
  }
  cb(new Error('File type not allowed'));
};

// Multer middleware setup
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) },
  fileFilter
}).single('file');

// Upload Route
// router.post('/upload', auth, (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     }
//     res.send({ message: 'File uploaded successfully', file: req.file });
//   });
// });

router.get('/upload', auth, (req, res) => {
  res.render('upload', { title: 'Upload' });
});

module.exports = router;
