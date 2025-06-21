const express = require('express');
const router = express.Router();
const { getJadwal } = require('../../controllers/mahasiswa/detailJadwal');
const userGuard = require('../../middleware/decodeJWT')

// Rute untuk menampilkan detail jadwal seminar berdasarkan id_pendaftaran
router.get('/', userGuard, getJadwal);

module.exports = router;

// var express = require('express');
// var router = express.Router();
// const nilaiController = require('../../controllers/mahasiswa/melihatnilai');

// /* GET users listing. */
// router.get('/', (req, res)=> {
//   res.render('mahasiswa/melihatdandownloadnilai');
// });

// module.exports = router;
