var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var evaluasiRouter = require('./routes/mahasiswa/evaluasiSisemhas');
var melihatRouter = require('./routes/mahasiswa/melihatdandownloadnilai');
var panduanRouter = require('./routes/mahasiswa/panduan');
var checkRouter = require('./routes/mahasiswa/checkberkas');
var mahasiswaRouter = require('./routes/mahasiswa/dashboardMhs');
var perbaikanRouter = require('./routes/mahasiswa/revisi');
var pendaftaranRouter = require('./routes/mahasiswa/pendaftaran');
var uploadRouter = require('./routes/mahasiswa/upload');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mahasiswa', evaluasiRouter);
app.use('/melihat', melihatRouter);
app.use('/panduan', panduanRouter);
app.use('/check', checkRouter);
app.use('/revisi', perbaikanRouter);

app.use('/dashboardMhs', mahasiswaRouter);
app.use('/daftar', pendaftaranRouter);
app.use('/mahasiswa/upload', uploadRouter);


app.use((req, res, next) => {
  console.log('🔥 DEBUG Middleware:', req.method, req.url, req.body);
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(`[APP.JS] Request method: ${req.method}, URL: ${req.url}`);
  next(createError(404));
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
