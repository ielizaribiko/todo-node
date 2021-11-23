var createError = require('http-errors');
var express = require('express');
//var dust = require('adaro');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { fstat } = require('fs');

var app = express();

// view engine setup
//app.engine('dust', dust.dust({}));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'dust');
app.engine('dust', cons.dust);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public'),{ once: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   //res.render('error');
//   var tmpl = require('./public/javascripts/compiled/templates.js')(dust);
//   tmpl({title: 'TO-DO App', nombre: 'Tony'}, function(err, out) {
//     res.send(out);
//   });
// });

module.exports = app;
