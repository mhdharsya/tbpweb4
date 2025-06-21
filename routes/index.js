var express = require('express');
var router = express.Router();
const { login, register } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');
const { getDashboardD } = require('../controllers/dosen/dosen'); 
const { getFormDashboard } = require('../controllers/mahasiswa/dashboard');

/* GET home page. */

router.get('/login', (req, res) => {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});


router.get('/dashboard', auth, async (req, res) => {
  if (req.user.role === 'ADMIN') {
    return res.render('admin/dashboardAdmin');
  } else if (req.user.role === 'DOSEN', getDashboardD) {
    return res.render('dosen/dashboardD', { dosen: req.user });
  } else if (req.user.role === 'KADEP') {
    return res.render('kadep');
  } else if (req.user.role === 'MAHASISWA') {
    return await getFormDashboard(req, res); // ✅ INI SAJA!
  } else {
    return res.status(403).json({ message: 'Access denied. Invalid role.' });
  }
});

router.post('/login', login);
router.post('/register', register);

module.exports = router;