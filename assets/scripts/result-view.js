var templateList = require('../template/list.hbs');
var templateColor = require('../template/color.hbs');
var templateFont = require('../template/font.hbs');
var templatePaths = require('../template/path.hbs');
var prettify = require('stylestats/lib/prettify.js');

module.exports = Parse.View.extend({
  el: '#js-resultView',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.$el.on('click', '.js-share', this.setShareURI);
  },
  processData: function (data) {
    Object.keys(data).forEach(function (key) {
      if (typeof data[key] === 'string') {
        data[key] = data[key].replace(/\n/g, '<br>');
      }
    });
    data['Paths'] = templatePaths({ paths: [data['Paths']] });
    if (data['Unique Colors'] !== 'N/A') {
      data['Unique Colors'] = templateColor({
        color: data['Unique Colors'].split(/<br>/)
      });
    }
    if (data['Unique Font Families'] !== 'N/A') {
      data['Unique Font Families'] = templateFont({
        font: data['Unique Font Families'].split(/<br>/)
      });
    }
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
    this.$el.html(templateList({results: data}));
    return this;
  }
});