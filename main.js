var path = require('path');
var csrf = require('csurf');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var session = require('express-session');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var app = express();
var env = process.env.NODE_ENV || 'development';

var util = require('./lib/util.js');
var Parse = require('parse').Parse;
Parse.initialize(util.ID, util.KEY);

app.use(morgan('dev'));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

app.engine('hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// CSRF
app.use(cookieParser());
app.use(session({
  secret: '234D&CSSF',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(csrf());
app.use(function (request, response, next) {
  response.cookie('XSRF-TOKEN', request.csrfToken());
  response.locals.csrf_token = request.csrfToken();
  next();
});

app.use(serveStatic(path.join(__dirname, 'public')));

if (env === 'development') {
  app.use(errorHandler());
  app.locals.pretty = true;
}

// Redirect root domain to www.
if (env === 'production') {
  app.all(/.*/, function (request, response, next) {
    var host = request.header('host');
    if (host.match(/^www\..*/i)) {
      next();
    } else {
      response.redirect(301, 'http://www.' + host);
    }
  });
}

app.get('/', require('./routes/index'));
app.get('/compare/', require('./routes/compare'));
app.get('/search/', require('./routes/search'));
app.get('/results/*', require('./routes/results'));
app.post('/parse', require('./routes/parse'));

// 404 Page Not Found
app.use(function (request, response, next) {
  response.status(404);
  response.render('404', {
    title: "404 Page Not Found | StyleStats",
    header: "404 Page Not Found :("
  });
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Express server listening on port ' + (process.env.PORT || 5000));
});