module.exports = function (request, response) {

  var id = request.params[0];
  var Parse = require('parse').Parse;
  var Result = Parse.Object.extend('Result');
  var query = new Parse.Query(Result);

  query.equalTo('objectId', id);
  query.first().then(function (data) {
    if (data) {
      var title = data.get('paths')[0] + ' - ' + data.createdAt;

      var result = JSON.stringify(data.attributes);
      response.render('index', {
        title: 'StyleStats Test Result | ' + title,
        result: result
      });
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