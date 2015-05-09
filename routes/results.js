var prettify = require('stylestats/lib/prettify.js');
var util = require('../lib/util.js');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {
  var id = request.params[0];
  var flag = true;
  if (id.indexOf('.json') !== -1) {
    flag = false;
    id = id.replace(/\.json/, '');
  }
  // Search for Object ID
  query.equalTo('objectId', id);
  query.first({
    success: function (data) {
      if (data) {
        var ranks = [];

        var props = data.attributes.propertiesCount;
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


        var result = prettify(data.attributes);
        util.processData(result);
        var title = data.get('paths')[0] + ' - ' + data.createdAt;

        if (flag) {
          response.render('index', {
            title: 'StyleStats Test Result | ' + title,
            data: [result],
            id: data.id,
            properties: JSON.stringify(ranks)
          });
        } else {
          response.json(data.attributes);
        }

      } else {
        response.render('404', {
          title: "Test not found | StyleStats",
          header: "Test not found :("
        });
      }
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