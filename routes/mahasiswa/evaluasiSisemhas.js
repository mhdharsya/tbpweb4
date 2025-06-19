// File: C:\PwebIla\tbpweb4\routes\mahasiswa\evaluasiSisemhas.js

var express = require('express');
var router = express.Router();

// PERBAIKAN DI BARIS INI
// Dari routes/mahasiswa, naik dua level (../../) untuk sampai ke tbpweb4
// Lalu masuk ke folder controllers
const evaluationController = require('../../controllers/evaluationController');

/* GET /mahasiswa - Menampilkan form evaluasi */
router.get('/', (req, res) => {
  console.log('[EVALUASI_ROUTER] Masuk ke POST /');
  res.render('mahasiswa/evaluasiSisemhas');
});

/* POST /mahasiswa - Menerima dan menyimpan data evaluasi */
router.post('/', evaluationController.createEvaluation);

module.exports = router;