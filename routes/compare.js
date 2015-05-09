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

      results.forEach(function (result) {
        var data = prettify(result.attributes);
        util.processData(data);
        datum.push(data);
        props.push(util.convertData(result));
      });

      response.render('compare', {
        title: 'Compare | StyleStas',
        data: datum,
        properties: JSON.stringify(props),
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