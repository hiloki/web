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
      var numDatum = [];
      var paths = [];
      results.forEach(function (result) {
        var numData = [];
        paths.push(result.attributes.paths[0]);
        numData.push(result.attributes.size);
        numData.push(result.attributes.gzippedSize);
        numDatum.push(numData);
        var data = prettify(result.attributes);
        util.processData(data);
        datum.push(data);
        props.push(util.convertData(result));
      });
      numDatum.push(paths);
      numDatum.push(['Size', 'Gzipped Size']);

      response.render('compare', {
        title: 'StyleStas Test Result Comparison',
        data: datum,
        properties: JSON.stringify(props),
        numData: JSON.stringify(numDatum),
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