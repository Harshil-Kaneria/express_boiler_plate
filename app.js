let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let helmet = require('helmet');
let rateLimit = require('express-rate-limit');
let bodyParser = require('body-parser');
let cors = require('cors');
let Joi = require('joi');

let corsConfig = require('./config/cors');

let adminPanelRouter = require('./routes/admin_panel_routes');
let apiOpenRoutesV1 = require('./routes/api_open_routes_v1');
let apiSecureRoutesV1 = require('./routes/api_secure_routes_v1');

global.helpers = require('./helpers');
global.middlewares = require('./middlewares');
global.Joi = Joi

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Apply Helmet,cros & Rate limiting for security
app.use(helmet());
app.use(cors(corsConfig));
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Min
  max: 500, // Limit each IP to 500 requests per windowMs
  handler: function(req, res, next) {
    next(createError(429, 'Too many requests, please try again later.'));
  }
});
if (process.env.RATE_LIMITER === 'true') app.use(limiter);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Setting up helper for sending a response
app.use((req, res, next) => {
  global.req = req
  global.res = res
  global.next = next
  next();
});

app.use('/admin', adminPanelRouter);
app.use('/public/api/v1', apiOpenRoutesV1);
app.use('/api/v1', apiSecureRoutesV1);

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