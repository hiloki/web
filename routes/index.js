var StyleStats = require('stylestats');
var moment = require('moment');
var numeral = require('numeral');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

exports.index = function(request, response) {
  response.render('index', {
    title: 'StyleStats'
  });
};

exports.parse = function(request, response) {
  var path = request.body.path;
  var css = request.body.css;

  var stylestats = new StyleStats(path || css);
  stylestats.parse(function(result) {
    response.send(prettify(result));
  });
};

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