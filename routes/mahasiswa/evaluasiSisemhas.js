var express = require('express');
var router = express.Router();
router.get('/', (req, res) => {
  console.log('[EVALUASI_ROUTER] Masuk ke POST /');
  res.render('mahasiswa/evaluasiSisemhas');
});

module.exports = router;