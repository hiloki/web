var templateAll = require('../template/perfect-list.hbs');
var prettify = require('stylestats/lib/prettify.js');

module.exports = Parse.View.extend({
  el: '#js-resultView',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.$el.on('click', '.js-share', this.setShareURI);
  },
  processData: function (data) {
    var KEY_ARRY = [
      'Paths',
      'Lowest Cohesion Selector',
      'Unique Font Families',
      'Unique Font Sizes',
      'Unique Colors',
      'Properties Count'
    ];
    Object.keys(data).forEach(function (key) {
      if (KEY_ARRY.indexOf(key) !== -1) {
        data[key] = data[key].replace(/\n/g, '<br>').split('<br>');
      }
    });
    data['Properties Count'] = data['Properties Count'].slice(0,9);
  },
  setShareURI: function () {
    if ($(this).data('clicked')) return;
    var path = $(this).attr('href') + encodeURIComponent(location.href);
    $(this).attr('href', path);
    $(this).data('clicked', true);
  },
  clearResultView: function () {
    this.remove();
  },
  render: function () {
    var data = prettify(this.model.attributes);
    this.processData(data);
    console.log(data);
    this.$el.html(templateAll({data: data}));
    return this;
  }
});