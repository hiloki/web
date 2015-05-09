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
    success: function (result) {
      if (result) {
        var title = util.createTitle(result.get('paths')[0], result.createdAt);

        var datum = [];
        var props = [];

        var data = prettify(result.attributes);
        util.processData(data);
        datum.push(data);
        props.push(util.convertData(result));

        if (flag) {
          response.render('index', {
            title: title,
            data: datum,
            properties: JSON.stringify(props),
            id: result.id
          });
        } else {
          response.json(result.attributes);
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