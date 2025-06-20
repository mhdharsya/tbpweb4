const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tentukan folder untuk menyimpan file yang diupload
const uploadPath = path.join(__dirname, 'uploads');  // Ganti dengan lokasi folder yang diinginkan

// Pastikan folder upload ada, jika tidak buat foldernya
fs.promises.mkdir(uploadPath, { recursive: true }).catch((err) => {
  console.error('Gagal membuat folder upload:', err);
});

// Pengaturan penyimpanan dengan multer
const storage = multer.memoryStorage();  // Menyimpan file dalam buffer di memori

// Pengaturan multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },  // Maksimal file 20MB
  fileFilter: (req, file, cb) => {
    // Filter untuk hanya menerima file PDF
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Hanya file PDF yang diperbolehkan'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
