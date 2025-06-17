const multer = require('multer');

// Menggunakan memoryStorage untuk menyimpan file di memory (buffer)
const storage = multer.memoryStorage();

// Konfigurasi multer dengan batasan ukuran file dan filter tipe file
const upload = multer({
  storage: storage,  // Menyimpan file di memory
  limits: { fileSize: 20 * 1024 * 1024 },  // Membatasi ukuran file maksimal 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf']; // Membatasi hanya file PDF
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  }
});

module.exports = upload;
