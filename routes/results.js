var prettify = require('stylestats/lib/prettify.js');
var util = require('../assets/scripts/util.js');

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
  query.equalTo('objectId', id);
  query.first().then(function (data) {
    if (data) {
      var rank = JSON.stringify(data.attributes.propertiesCount);
      var result = prettify(data.attributes);
      util.processData(result);
      var title = data.get('paths')[0] + ' - ' + data.createdAt;

      if (flag) {
        response.render('index', {
          title: 'StyleStats Test Result | ' + title,
          data: [result],
          id: data.id,
          properties: rank
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
  }, function (error) {
    response.render('404', {
      title: "Database is busy | StyleStats",
      header: "Database is busy :("
    });
  });

};