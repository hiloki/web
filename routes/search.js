var moment = require('moment');
var numeral = require('numeral');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');


module.exports = function (request, response) {

  if (request.query.q === undefined) {
    response.render('search', {
      title: 'Test Result Logs | StyleStats',
      searchResults: true
    });
    return;
  }

  var subqueries = [];
  var q = decodeURIComponent(request.query.q);
  q.trim().split(' ').forEach(function (value) {
    var subquery = new Parse.Query(Result);
    subquery.contains('path', value);
    subqueries.push(subquery);
  });

  var query = Parse.Query.or.apply(null, subqueries);
  query.limit(10);
  query.descending("createdAt");
  query.find({
    success: function (results) {
      var datum = [];
      results.forEach(function(result){
        var resultData = result.attributes;
        var byte = numeral(resultData.size).format('0.0b');
        byte.replace(/\.0B/, 'B').replace(/0\.0/, '0');

        var data = {
          path: resultData.path,
          time: moment(result.createdAt).format('MM/DD/YY HH:mm:ss'),
          size: byte,
          rules: resultData.rules,
          selectors: resultData.selectors,
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