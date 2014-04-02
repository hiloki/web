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

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/parse', routes.parse);

app.listen(process.env.PORT || 5000, function() {
  console.log('Express server listening on port ' + (process.env.PORT || 5000));
});