var express = require('express');
var router = express.Router();
const userGuard = require('../../middleware/decodeJWT');

// PERBAIKAN DI BARIS INI
// Dari routes/mahasiswa, naik dua level (../../) untuk sampai ke tbpweb4
// Lalu masuk ke folder controllers
// const evaluationController = require('../../controllers/mahasiswa/evaluationController');
const evaluationController = require('../../controllers/admin/evaluationController');

/* GET /mahasiswa - Menampilkan form evaluasi */
router.get('/', userGuard, (req, res) => {
  console.log('[EVALUASI_ROUTER] Masuk ke POST /');
  res.render('mahasiswa/evaluasiSisemhas');
});

/* POST /mahasiswa - Menerima dan menyimpan data evaluasi */
// router.post('/', evaluationController.createEvaluation);

module.exports = router;