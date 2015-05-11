var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {

  var q = decodeURIComponent(request.query.q);
  var regex = new RegExp(q);
  query.matches('path', regex);
  query.limit(10);

  query.find({
    success: function (results) {
      var datum = [];
      results.forEach(function(result){
        var data = {
          path: result.attributes.path,
          time: result.createdAt,
          uri: '/results/' + result.id,
          id: result.id
        };
        datum.push(data);
      });

      response.render('search', {
        title: 'Test Result Logs | StyleStats',
        searchResults: datum
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