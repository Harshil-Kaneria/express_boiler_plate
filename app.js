let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let helmet = require('helmet');
let rateLimit = require('express-rate-limit');

let adminPanelRouter = require('./routes/admin_panel_routes');
let apiOpenRoutes = require('./routes/api_open_routes');
let apiSecureRoutes = require('./routes/api_secure_routes');

global.helpers = require('./helpers');
global.middlewares = require('./middlewares');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Apply Helmet for security
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Min
  max: 200, // Limit each IP to 500 requests per windowMs
  handler: function(req, res, next) {
    next(createError(429, 'Too many requests, please try again later.'));
  }
});
if (process.env.RATE_LIMITER === 'true') app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminPanelRouter);
app.use('/public/api/v1', apiOpenRoutes);
app.use('/api/v1', apiSecureRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Not found'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error', { APP_SHORT_NAME: process.env.APP_SHORT_NAME, APP_NAME: process.env.APP_NAME });
});

module.exports = app;