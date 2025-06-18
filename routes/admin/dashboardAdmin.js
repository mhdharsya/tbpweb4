// routes/admin/dashboardAdmin.js
var express = require('express');
var router = express.Router();

/* GET admin dashboard page. */
// Ini akan menjadi route default /admin/
router.get('/', function(req, res, next) {
  // Render halaman admin dan beritahu frontend untuk merender 'daftarRoleUser' sebagai default
  res.render('admin/dashboardAdmin', { initialPageId: 'daftarRoleUser' });
});

/* GET Daftar Role User page. */
// Route spesifik untuk Daftar Role User
router.get('/daftar-role-user', function(req, res, next) {
  res.render('admin/dashboardAdmin', { initialPageId: 'daftarRoleUser' });
});

/* GET Permintaan Akses page. */
// Route spesifik untuk Permintaan Akses
router.get('/permintaan-akses', function(req, res, next) {
  res.render('admin/dashboardAdmin', { initialPageId: 'permintaanAkses' });
});

/* GET Panduan Seminar page. */
// Route spesifik untuk Panduan Seminar
router.get('/panduan-seminar', function(req, res, next) {
  res.render('admin/dashboardAdmin', { initialPageId: 'panduanSeminar' });
});

/* GET Evaluasi Sistem page. */
// Route spesifik untuk Evaluasi Sistem
router.get('/evaluasi-sistem', function(req, res, next) {
  res.render('admin/dashboardAdmin', { initialPageId: 'evaluasiSistem' });
});

/* GET Daftar Jadwal page. */
// Route spesifik untuk Daftar Jadwal
router.get('/daftar-jadwal', function(req, res, next) {
  res.render('admin/dashboardAdmin', { initialPageId: 'daftarJadwal' });
});

module.exports = router;