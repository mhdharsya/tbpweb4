var express = require('express');
var router = express.Router();
const methodOverride = require('method-override');
const { login, register, showLogin } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');
const { getDashboardD } = require('../controllers/dosen/dosen'); 
const { getFormDashboard } = require('../controllers/mahasiswa/dashboard');
const { listBidangKeahlian, createJadwal, updateJadwal, deleteJadwal } = require('../controllers/kadepController');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('kadep');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});


router.get('/dashboard', auth, getFormDashboard, async (req, res) => {
  if (req.user.role === 'ADMIN') {
    return res.render('admin/dashboardAdmin');
  } else if (req.user.role === 'DOSEN', getDashboardD) {
    return res.render('dosen/dashboardD', { dosen: req.user });
  } else if (req.user.role === 'KADEP') {
    return res.render('kadep');
  } else if (req.user.role === 'MAHASISWA') {
    return res.render('mahasiswa/dashboardMhs', {
        nama_lengkap: user.nama_lengkap}); // ✅ INI SAJA!
  } else {
    return res.status(403).json({ message: 'Access denied. Invalid role.' });
  }
});

router.get('/login', showLogin);
router.post('/login', login);
router.post('/register', register);


// Controller Kadep
router.use(methodOverride('_method'));
router.get('/bidang-keahlian', listBidangKeahlian);
router.post('/bidang-keahlian', createJadwal);
router.put('/:nip/bidang-keahlian', updateJadwal);
router.delete('/:nip/bidang-keahlian', deleteJadwal);
router.get('/dosenpenguji', (req, res) => {
  res.render('kadep/dosenpenguji');
});
router.get('/kuota', (req, res) => {
  res.render('kadep/kuota');
});
router.get('/periodependaftaran', (req, res) => {
  res.render('kadep/periodependaftaran');
});
router.get('/rekapitulasi', (req, res) => {
  res.render('kadep/rekapitulasi');
});
router.get('/rubrikpenilaian', (req, res) => {
  res.render('kadep/rubrikpenilaian');
});
router.get('/statistik', (req, res) => {
  res.render('kadep/statistikseminar');
});

module.exports = router;