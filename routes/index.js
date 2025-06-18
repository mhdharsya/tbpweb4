var express = require('express');
var router = express.Router();
const { login, register } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

/* GET home page. */
router.get('/login', (req, res) => {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});


router.get('/dashboard', auth, (req, res) =>{
  if (req.user.role === 'ADMIN') {
    return res.render('admin/dashboardAdmin');
  } else if (req.user.role === 'DOSEN') {
    return res.render('dashboard dosen');
  } else if (req.user.role === 'KADEP') {
    return res.render('kadep');
  } else if (req.user.role === 'MAHASISWA') {
    return res.render('mahasiswa/dashboardMhs');
  } else {
    return res.status(403).json({ message: 'Access denied. Invalid role.' });
  }
});

router.post('/login', login);
router.post('/register', register);

module.exports = router;
