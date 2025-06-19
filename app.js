var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var daftarRouter = require('./routes/mahasiswa/pendaftaran');
var dashboardRouter = require('./routes/mahasiswa/dashboardMhs');
var uploadRouter = require('./routes/mahasiswa/upload');
var riwayatSeminarRouter = require('./routes/mahasiswa/riwayatseminar');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/daftar', daftarRouter);
app.use('/dashboard', dashboardRouter);
app.use('/mahasiswa', uploadRouter);
app.use('/riwayatseminar', riwayatSeminarRouter);

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
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
