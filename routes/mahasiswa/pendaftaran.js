const express = require('express');
const router = express.Router();
const pendaftaranController = require('../../controllers/mahasiswa/pendaftaran');

// GET: Tampilkan form
router.get('/', pendaftaranController.getFormPendaftaran);

// POST: Submit form
router.post('/', pendaftaranController.submitFormPendaftaran);

module.exports = router;
