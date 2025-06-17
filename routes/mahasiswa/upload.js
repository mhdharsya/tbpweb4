const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload'); // Import konfigurasi multer
const uploadController = require('../../controllers/mahasiswa/upload');

// Route untuk menampilkan form upload
router.get('/', uploadController.getUploadForm);

// Route untuk menangani upload file
router.post('/',
  upload.fields([
    { name: 'krs', maxCount: 1 },
    { name: 'ppt', maxCount: 1 },
    { name: 'lampiran', maxCount: 1 },
    { name: 'laporan', maxCount: 1 },
  ]),
  uploadController.handleUpload // Menangani upload file setelah form disubmit
);

module.exports = router;
