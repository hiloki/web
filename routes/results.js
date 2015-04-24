module.exports = function (request, response) {

  var id = request.params[0];
  var Parse = require('parse').Parse;
  var Result = Parse.Object.extend('Result');
  var query = new Parse.Query(Result);

  query.equalTo('objectId', id);
  query.first().then(function (data) {
    if (data) {
      var result = JSON.stringify(data.attributes);
      response.render('index', {
        title: 'StyleStats',
        result: result
      });
    } else {
      response.render('404', {
        title: "404 Page Not Found :("
      });
    }
  }, function (error) {
    response.render('404', {
      title: "404 Page Not Found :("
    });
  });

};