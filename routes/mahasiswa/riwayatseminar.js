var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('mahasiswa/riwayatseminar', { title: 'Riwayat Seminar' });
});

module.exports = router;