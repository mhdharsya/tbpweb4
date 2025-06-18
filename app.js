var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/dashboardAdmin')
var userController = require('./controllers/userController');
var accessRequestController = require('./controllers/accessRequestController');
var evaluasiSistemController = require('./controllers/evaluasiSistemController'); // <--- PASTIKAN INI ADA DAN PATHNYA BENAR
var panduanController = require('./controllers/panduanController');

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
app.use('/admin', adminRouter);
app.get('/api/users', userController.getAllUsersWithDetailsOptimized);
app.get('/api/evaluations', evaluasiSistemController.getEvaluationsApi);

app.post('/api/panduan/upload', panduanController.upload.single('pdfFile'), panduanController.uploadPanduanApi); // 'pdfFile' adalah nama field di form
app.get('/api/panduan/latest', panduanController.getLatestPanduanApi);
app.get('/api/panduan/list', panduanController.getAllPanduanApi);
app.get('/api/panduan/file/:id', panduanController.getPanduanFileApi);
app.get('/api/evaluations/generate-pdf', evaluasiSistemController.generateEvaluationsPdfApi);


app.get('/api/access-requests', accessRequestController.getAccessRequests);
app.post('/api/access-requests/:nim/accept', accessRequestController.acceptAccessRequest);
app.post('/api/access-requests/:nim/reject', accessRequestController.rejectAccessRequest);
app.patch('/api/users/roles', userController.updateUsersRoles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
    console.log('GLOBAL DEBUG: Request URL:', req.url);
    console.log('GLOBAL DEBUG: req.query (at start):', req.query);
    next(); // Sangat penting untuk memanggil next()
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
