var StyleStats = require('stylestats');
var prettify = require('stylestats/lib/prettify');

module.exports = function (request, response) {
  var path = request.body.path;
  var css = request.body.css;
  var stylestats = new StyleStats(path || css);
  stylestats.parse(function (error, result) {
    if (error) {
      response.send(500, 'Something broken!');
    }
    response.json(prettify(result));
  });
};