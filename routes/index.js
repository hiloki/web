var moment = require('moment');
var numeral = require('numeral');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);


module.exports = function (request, response) {
  query.descending('createdAt');
  query.limit(10);
  query.find({
    success: function (results) {
      var data = [];
      results.forEach(function (result) {
        var resultData = result.attributes;
        var byte = numeral(resultData.size).format('0.0b');
        byte.replace(/\.0B/, 'B').replace(/0\.0/, '0');
        var faviconArry = resultData.paths[0].split('/');
        var favicon = faviconArry[0] + '//' + faviconArry[2] + '/favicon.ico';
        var obj = {
          icon: favicon,
          id: result.id,
          size: byte,
          time: moment(result.createdAt).fromNow(),
          uri: resultData.paths[0]
        };
        data.push(obj);
      });
      response.render('index', {
        title: 'StyleStats - An evaluating tool for writing better CSS.',
        results: data
      });
    },
    error: function(error) {
      response.render('index', {
        title: 'StyleStats - An evaluating tool for writing better CSS.'
      });
    }
  });

};