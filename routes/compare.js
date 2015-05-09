var prettify = require('stylestats/lib/prettify.js');
var util = require('../assets/scripts/util.js');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {
  query.containedIn('objectId', [request.query.id1, request.query.id2]);

  query.find({
    success: function (results) {
      var data = [];
      results.forEach(function (result) {
        var raw = prettify(result.attributes);
        util.processData(raw);
        data.push(raw);
      });
      response.render('compare', {
        compare: true,
        title: 'Compare',
        data: data
      });
    },
    error: function (error) {
      console.log(error);
    }
  });

};