var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {
  query.matches('paths', /http/);
  query.limit(10);
  query.find({
    success: function (results) {
      console.log('================||| ', results.length);
      response.render('search', {
        title: 'StyleStats'
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