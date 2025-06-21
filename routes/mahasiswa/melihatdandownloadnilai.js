var express = require('express');
var router = express.Router();
const nilaiController = require('../../controllers/mahasiswa/melihatnilai');

/* GET users listing. */
router.get('/', (req, res)=> {
  res.render('mahasiswa/melihatdandownloadnilai');
});

module.exports = router;
