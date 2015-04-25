var order = require('stylestats/assets/aliases.json');

module.exports = Parse.Router.extend({
  routes: {
    'results/:id': 'results'
  },
  results: function (id) {
    var rawData = JSON.parse($('#js-result').text());
    var data = {};
    Object.keys(order).forEach(function (key) {
      if (rawData[key]) {
        data[key] = rawData[key];
      }
    });
    result.set(data);
  }
});