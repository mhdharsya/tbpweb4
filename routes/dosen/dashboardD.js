const express = require('express');
const router = express.Router();

// Panggil middleware dan controller dengan path & NAMA FILE yang benar
// Nama file middleware Anda adalah 'dosen.js'
const dosenMiddleware = require('../../middleware/dosen'); 
const dosenController = require('../../controllers/dosen/dosen');

router.get('/', dosenMiddleware, dosenController.getDashboard);


module.exports = router;