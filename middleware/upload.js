const multer = require('multer');
const path = require('path');

// Menentukan lokasi dan nama file yang diupload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pastikan folder 'uploads/' ada
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // Memberikan nama file yang unik
  }
});

// Konfigurasi multer dengan batasan file size dan tipe file
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Set ukuran maksimal file menjadi 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf']; // Hanya menerima file PDF
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  }
});

module.exports = upload;
