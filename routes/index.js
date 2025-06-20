var express = require('express');
var router = express.Router();
const { login, register, showLogin } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('kadep/bidangkeahlian');
  // res.redirect('/login');
});

router.get('/dashboard', auth, (req, res) =>{
  if (req.user.role === 'ADMIN') {
    return res.render('dashboard admin');
  } else if (req.user.role === 'DOSEN') {
    return res.render('dashboard dosen');
  } else if (req.user.role === 'KADEP') {
    return res.render('kadep');
  } else if (req.user.role === 'MAHASISWA') {
    return res.render('dashboard mahasiswa');
  } else {
    return res.status(403).json({ message: 'Access denied. Invalid role.' });
  }
});

router.get('/login', showLogin);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
