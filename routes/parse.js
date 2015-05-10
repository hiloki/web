var StyleStats = require('stylestats');
var config = {"propertiesCount": 1000};

module.exports = function (request, response) {
  var path = request.body.path;
  var stylestats = new StyleStats(path, config);
  stylestats.parse(function (error, result) {
    if (error) {
      response.send(500, 'Something broken!');
    }
    response.json(result);
  });
};