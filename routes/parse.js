var StyleStats = require('stylestats');

module.exports = function (request, response) {
  var path = request.body.path;
  var stylestats = new StyleStats(path);
  stylestats.parse(function (error, result) {
    if (error) {
      response.send(500, 'Something broken!');
    }
    response.json(result);
  });
};