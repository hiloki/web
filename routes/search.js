var prettify = require('stylestats/lib/prettify.js');
var util = require('../lib/util.js');

var Parse = require('parse').Parse;
var Result = Parse.Object.extend('Result');
var query = new Parse.Query(Result);

module.exports = function (request, response) {
  console.log(request.query.q);
  // Search for comparing Object IDs
  // query.containedIn('objectId', [request.query.id1, request.query.id2]);

  query.find({
    success: function (results) {


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