var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users')
var authRouter = require('./routes/auth');
var adminRoter = require('./routes/admin');

var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views/Peminjam'),
  path.join(__dirname, 'views/Admin'),
  path.join(__dirname, 'views')
]);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/preline/dist')));

var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 *  24
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  res.locals.messageType = req.flash('messageType');
  next();
});

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRoter);

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
  res.render('error');
});

module.exports = app;
