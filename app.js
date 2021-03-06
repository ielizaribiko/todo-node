var createError = require('http-errors');
var express = require('express');
var dust = require('adaro');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

var LowdbDatabase = require('./services/database');
var db = new LowdbDatabase();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { fstat } = require('fs');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


var app = express();
app.use(connectLiveReload());

// view engine setup
var opts = {
  helpers: [
    './views/helpers/custom-helpers', // relative paths work
    'dustjs-helpers', // so do installed modules
    // {
    //   name: './my/factory',
    //   arguments: [ 'an argument' ] // or use this signature if you need to pass in additional args
    // }
  ]
};
app.engine('dust', dust.dust(opts));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'less'),{ debug: true, dest: path.join(__dirname,'public'), once: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{err});
});

module.exports = app;
