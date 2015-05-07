var templateAll = require('../template/perfect-list.hbs');
var prettify = require('stylestats/lib/prettify.js');

module.exports = Parse.View.extend({
  el: '#js-resultView',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.$el.on('click', '.js-share', this.setShareURI);
    this.renderPieChart();
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
  },
  renderPieChart: function(){
    var properties = JSON.parse($('#js-prop-data').html());
    var results = [];
    var count = 0;
    properties.forEach(function (obj, index) {
      if (index < 5) {
        var result = [obj.property, obj.count];
        results.push(result);
      } else {
        count += obj.count;
      }
    });
    results.push(['Other', count]);

    $('#js-prop-chart').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        spacing: [0, 0, 10, 0]
      },
      colors: ['#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D'],
      title: false,
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%, {point.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Properties share',
        data: results
      }]
    });
  }
});