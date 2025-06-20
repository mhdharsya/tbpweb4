const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const uploadController = require('../../controllers/mahasiswa/upload');

router.get('/upload/:id_pendaftaran', 
  uploadController.getUploadForm  // Menggunakan controller untuk handle upload
);

router.post('/upload/:id_pendaftaran', 
  upload.fields([
    { name: 'krs', maxCount: 1 },
    { name: 'ppt', maxCount: 1 },
    { name: 'lampiran', maxCount: 1 },
    { name: 'laporan', maxCount: 1 },
  ]), 
  uploadController.handleUpload  // Menggunakan controller untuk handle upload
);

module.exports = router;
