var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Impor Router & Controller yang dibutuhkan
// PASTIKAN PATH KE FILE ANDA SUDAH BENAR SESUAI STRUKTUR FOLDER ANDA
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var daftarRouter = require('./routes/mahasiswa/pendaftaran');
var dashboardRouter = require('./routes/mahasiswa/dashboardMhs');
var uploadRouter = require('./routes/mahasiswa/upload');
var riwayatSeminarRouter = require('./routes/mahasiswa/riwayatseminar');
var adminRouter = require('./routes/admin/dashboardAdmin');
var detailJadwalRouter = require('./routes/mahasiswa/detailJadwal');
var panduanRouter = require('./routes/mahasiswa/panduan');
var evaluasiRouter = require('./routes/mahasiswa/evaluasiSisemhas');
var detailRiwayatRouter = require('./routes/mahasiswa/detailRiwayat')
const userController = require('./controllers/admin/userController');
const accessRequestController = require('./controllers/admin/accessRequestController');
const evaluasiSistemController = require('./controllers/admin/evaluasiSistemController'); 
const panduanController = require('./controllers/admin/panduanController'); 
var nilaiRouter = require('./routes/mahasiswa/melihatdandownloadnilai');
var statusRouter = require('./routes/admin/statusSemhas');
var detailJadwalRouter = require('./routes/mahasiswa/detailJadwal');
const pdfRiwayatRoutes = require('./routes/mahasiswa/detailRiwayat');

var app = express(); // Hanya satu deklarasi 'app' di sini

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =========================================================
// MIDDLEWARE UTAMA - PASTIKAN URUTANNYA SEPERTI INI!
// =========================================================
app.use(logger('dev'));
app.use(express.json()); // Untuk parsing JSON body dari POST/PUT/PATCH requests
app.use(express.urlencoded({ extended: false })); // Untuk parsing URL-encoded body dari form-data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Untuk menyajikan file statis (CSS, JS, gambar)
app.use('/temp_files', express.static(path.join(__dirname, 'temp_files')));

// =========================================================
// GLOBAL DEBUG MIDDLEWARE (Opsional, untuk debugging)
// Anda bisa menghapus ini setelah semua fitur bekerja dengan baik
// =========================================================
app.use((req, res, next) => {
    console.log('GLOBAL DEBUG: Request URL:', req.url);
    console.log('GLOBAL DEBUG: req.query (at start):', req.query);
    next();
});
// =========================================================


// =========================================================
// DEFINISI ROUTE - PENTING: ROUTE API SPESIFIK HARUS DI ATAS!
// =========================================================

// Route API untuk user (Daftar Role User)
app.get('/api/users', userController.getAllUsersWithDetailsOptimized);
app.patch('/api/users/roles', userController.updateUsersRoles);

// Route API untuk permintaan akses
app.get('/api/access-requests', accessRequestController.getAccessRequests);
app.post('/api/access-requests/:nim/accept', accessRequestController.acceptAccessRequest);
app.post('/api/access-requests/:nim/reject', accessRequestController.rejectAccessRequest);

// Route API untuk evaluasi sistem
app.get('/api/evaluations', evaluasiSistemController.getEvaluationsApi);
app.get('/api/evaluations/generate-pdf', evaluasiSistemController.generateEvaluationsPdfApi);

// Route API untuk panduan seminar hasil
app.post('/api/panduan/upload', panduanController.upload.single('pdfFile'), panduanController.uploadPanduanApi);
app.get('/api/panduan/latest', panduanController.getLatestPanduanApi);
app.get('/api/panduan/list', panduanController.getAllPanduanApi);
app.get('/api/panduan/file/:id', panduanController.getPanduanFileApi);


// Route-route umum lainnya (catch-all atau spesifik prefix) - DI BAWAH API
// Ini harus di bawah route API agar permintaan /api/... tidak ditangkap olehnya
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/daftar', daftarRouter);
app.use('/dashboard', dashboardRouter);
app.use('/mahasiswa', uploadRouter);
app.use('/', riwayatSeminarRouter);
app.use('/', detailRiwayatRouter);
app.use('/melihat', nilaiRouter);

//Router API untuk Generate Pendaftaran
app.use('/api', dashboardRouter);
app.use('/api', pdfRiwayatRoutes);

app.use('/panduan', panduanRouter); // Route untuk halaman panduan seminar hasil'
app.use('/evaluasi', evaluasiRouter); // Route untuk halaman evaluasi sistem
// app.use('/detail', detailJadwalRouter);
app.use('/', statusRouter);
app.use('/tampil', detailJadwalRouter);

app.use((req, res, next) => {
  console.log('Request URL:', req.url);  // Log URL
  console.log('Request Method:', req.method);  // Log HTTP Method
  next(); // Jangan lupa panggil next() untuk melanjutkan ke handler berikutnya
});

// async function checkPrismaConnection() {
//   try {
//     await prisma.$connect();
//     console.log("✅ Prisma connected to the database successfully.");
//   } catch (error) {
//     console.error("❌ Prisma connection error:", error);
//   }
// }

// checkPrismaConnection();
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
    console.log('GLOBAL DEBUG: Request URL:', req.url);
    console.log('GLOBAL DEBUG: req.query (at start):', req.query);
    next(); // Sangat penting untuk memanggil next()
});

app.use((req, res, next) => {
  console.log('Request URL:', req.url);  // Log URL
  next();
});

// error handler
// =========================================================
// ERROR HANDLER - PASTIKAN SUDAH DIPERBAIKI!
// =========================================================
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // Perbaiki agar API response juga mengirim JSON error
  // Tambahkan pengecekan untuk req.headers.accept sebelum memanggil indexOf
  if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
    res.json({ message: err.message, status: err.status || 500 });
  } else {
    res.render('error'); // Render halaman error untuk permintaan non-API
  }
});
// =========================================================

module.exports = app;