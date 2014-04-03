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
app.use(function(req, res, next) {
    res.locals.csrf_token = req.csrfToken();
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/parse', routes.parse);

app.listen(process.env.PORT || 5000, function() {
    console.log('Express server listening on port ' + (process.env.PORT || 5000));
});