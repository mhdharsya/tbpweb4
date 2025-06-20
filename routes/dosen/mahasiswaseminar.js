const express = require('express');
const router = express.Router();

const mahasiswaseminarController = require('../../controllers/dosen/mahasiswaseminar.js');

router.get('/', mahasiswaseminarController.getListMahasiswa);

module.exports = router;
