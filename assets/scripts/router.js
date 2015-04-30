var order = require('stylestats/assets/aliases.json');

module.exports = Parse.Router.extend({
  routes: {
    'results/:id': 'results'
  },
  results: function (id) {
    var rawData = JSON.parse($('#js-result').text());
    global.result.set(rawData);
  }
});