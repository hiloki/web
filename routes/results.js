var hbs = require('express-handlebars').create();
var prettify = require('stylestats/lib/prettify.js');

function processData(data) {
  var KEY_ARRY = [
    'Paths',
    'Lowest Cohesion Selector',
    'Unique Font Families',
    'Unique Font Sizes',
    'Unique Colors',
    'Properties Count'
  ];
  Object.keys(data).forEach(function (key) {
    if (KEY_ARRY.indexOf(key) !== -1) {
      data[key] = data[key].replace(/\n/g, '<br>').split('<br>');
    }
  });
  data['Properties Count'] = data['Properties Count'].slice(0, 9);
}

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
      processData(result);
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