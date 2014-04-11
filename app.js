var path = require('path');
var express = require('express');

var routes = require('./routes');
var app = express();

app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// CSRF
app.use(express.cookieParser());
app.use(express.session({
    secret: '234D&CSSF'
}));
app.use(express.csrf());
app.use(function(request, response, next) {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    response.locals.csrf_token = request.csrfToken();
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.compress());

app.configure('development', function() {
    app.use(express.errorHandler());
});

// Redirect root domain to www.
app.configure('production', function(){
    app.all(/.*/, function(request, response, next) {
      var host = request.header('host');
      if (host.match(/^www\..*/i)) {
        next();
      } else {
        response.redirect(301, 'http://www.' + host);
      }
    });
});

// 404 Page Not Found
app.use(function(request, response, next) {
    response.status(404);
    response.render('404', {
        title: "404 Page Not Found :("
    });
});

app.get('/', routes.index);
app.post('/parse', routes.parse);

app.listen(process.env.PORT || 5000, function() {
    console.log('Express server listening on port ' + (process.env.PORT || 5000));
});