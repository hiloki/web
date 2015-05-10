var prettify = require('stylestats/lib/prettify.js');
var util = require('../lib/util.js');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {

  // Search for comparing Object IDs
  query.containedIn('objectId', [request.query.id1, request.query.id2]);

  query.find({
    success: function (results) {
      var datum = [];
      var props = [];
      var sizes = [];
      var paths = [];
      results.forEach(function (result) {
        var rawData = result.attributes;
        var data = prettify(rawData);
        util.processData(data);
        datum.push(data);
        props.push(util.convertData(result));
        var size = [rawData.size, rawData.gzippedSize];
        sizes.push(size);
        paths.push(rawData.paths[0]);
      });
      sizes.push(paths, ['Size', 'Gzipped Size']);

      var alpha = results[0].attributes;
      var beta = results[1].attributes;
      Object.keys(alpha).forEach(function (key) {
        if (isNaN(alpha[key])) return;
        if (alpha[key] == beta[key]) {
          datum[0]['is_' + key] = true;
          datum[1]['is_' + key] = true;
        } else if (alpha[key] < beta[key]) {
          datum[0]['is_' + key] = true;
        } else {
          datum[1]['is_' + key] = true;
        }
      });
      // Higher Simplicity is better.
      datum.forEach(function (data) {
        data.is_simplicity = (data.is_simplicity) ? false : true;
      });

      response.render('compare', {
        title: 'StyleStats Test Result Comparison',
        data: datum,
        properties: JSON.stringify(props),
        sizes: JSON.stringify(sizes),
        is_compare: true
      });
    },
    error: function (error) {
      response.render('404', {
        title: "Database is busy | StyleStats",
        header: "Database is busy :("
      });
      console.log(error);
    }
  });
};