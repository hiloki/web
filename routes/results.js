module.exports = function (request, response) {
  var Parse = require('parse').Parse;
  var Result = Parse.Object.extend('Result');
  var query = new Parse.Query(Result);

  query.equalTo("objectId", "pUXbl6MCqe");
  query.find({
    success: function(result) {
      for (var i = 0; i < result.length; ++i) {
        console.log(result[i].get('paths'));
        unko = result[i].get('paths');
      }
    }
  });

  response.render('index', {
    title: 'StyleStats'
  });
};