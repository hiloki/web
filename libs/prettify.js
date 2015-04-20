var numeral = require('numeral');
var moment = require('moment');
var aliases = require('stylestats/assets/aliases.json');

var KEY_BYTE = [
  'size',
  'gzippedSize',
  'dataUriSize'
];
var KEY_PERCENT = [
  'simplicity',
  'ratioOfDataUriSize'
];
var KEY_NUMBER = [
  'averageOfCohesion',
  'averageOfIdentifier'
];

/**
 * Prettify StyleStats data.
 * @param {object} [result] StyleStats parse data. Required.
 * @return {array} prettified data.
 */
function prettify(result) {
  var collections = {};
  Object.keys(result).forEach(function (key) {
    var readableKey = aliases[key];
    var value = result[key];

    if (key === 'published') {
      value = moment(value).format('LLL');
    }
    if (key === 'propertiesCount') {
      var array = [];
      value.forEach(function (item) {
        array.push([item.property, item.count]);
      });
      value = array.join('<br>').replace(/\,/g, ': ');
    }
    if (KEY_BYTE.indexOf(key) !== -1) {
      value = numeral(value).format('0.0b');
    }
    if (KEY_PERCENT.indexOf(key) !== -1) {
      value = numeral(value).format('0.0%');
    }
    if (KEY_NUMBER.indexOf(key) !== -1) {
      value = numeral(value).format('0.000');
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        value = 0;
      } else {
        value = result[key].join('<br>');
      }
    }
    collections[readableKey] = value;
  });
  return collections;
}

module.exports = prettify;