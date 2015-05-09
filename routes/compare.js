var prettify = require('stylestats/lib/prettify.js');
var util = require('../lib/util.js');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {
  // Search for Object IDs
  query.containedIn('objectId', [request.query.id1, request.query.id2]);
  query.find({
    success: function (results) {
      var data = [];
      var ranks = [];
      results.forEach(function (result) {

        var props = result.attributes.propertiesCount;
        var rank = [];
        var count = 0;
        props.forEach(function (obj, index) {
          if (index < 5) {
            var result = [obj.property, obj.count];
            rank.push(result);
          } else {
            count += obj.count;
          }
        });
        rank.push(['Other', count]);

        ranks.push(rank);


        var raw = prettify(result.attributes);
        util.processData(raw);
        data.push(raw);
      });

      response.render('compare', {
        compare: true,
        title: 'Compare | StyleStas',
        data: data,
        properties: JSON.stringify(ranks)
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