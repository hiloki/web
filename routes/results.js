module.exports = function (request, response) {

  var Parse = require('parse').Parse;
  var Result = Parse.Object.extend('Result');
  var query = new Parse.Query(Result);

  query.equalTo("objectId", "pUXbl6MCqe");
  query.first().then(function(data) {
    var result = data.attributes;
    if (result) {
      response.render('index', {
        title: 'StyleStats',
        result: JSON.stringify(result)
      });
    } else {
      console.log(error);
    }
  }, function(error) {
    console.log(error);
  });
};