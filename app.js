/**
 * Module dependencies.
 */

var http = require('http'),
    path = require('path'),
    express = require('express'),
    routes = require('./routes'),
    StyleStats = require('stylestats');

var app = express();

var moment = require('moment');

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');
var numeral = require('numeral');

/**
 * Prettify StyleStats data.
 * @param {object} [result] StyleStats parse data. Required.
 * @return {array} prettified data.
 */
function prettify(result) {
    var collections = [];
    Object.keys(result).forEach(function(key) {
        var stats = {};
        stats.name = key;
        stats.prop = _(_(key).humanize()).titleize();
        if (key === 'propertiesCount') {
            var array = [];
            result[key].forEach(function(item) {
                array.push([item.property, item.count]);
            });
            stats.value = array.join('<br>').replace(/\,/g, ': ');
        } else if (key === 'published') {
            stats.value = moment().format('llll');
        } else if (key === 'size' || key === 'gzippedSize' || key === 'dataUriSize') {
            stats.value = numeral(result[key]).format('0.0b').replace(/\.0B/, 'B').replace(/0\.0/, '0');
        } else if (key === 'simplicity' || key === 'ratioOfDataUriSize') {
            stats.value = numeral(result[key]).format('0.0%');
        } else if (key === 'uniqueColor') {
            stats.value = result[key];
        } else {
            stats.value = Array.isArray(result[key]) ? result[key].join('<br>') : result[key];
            if (stats.value === '') {
                stats.value = 'N/A';
            }
        }
        collections.push(stats);
    });
    return collections;
}

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);


app.post('/parse', function(request, response) {
  var path = request.body.path;
  var css = request.body.css;

  var stylestats = new StyleStats(path || css);
  stylestats.parse(function(result) {
    response.send(prettify(result));
  });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});