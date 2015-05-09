var tempList = require('../../views/partials/list.hbs');
var prettify = require('stylestats/lib/prettify.js');
var util = require('../../lib/util.js');

module.exports = Parse.View.extend({
  el: '#js-resultView',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.$el.on('click', '.js-share', this.setShareURI);
    this.renderPieChart();
  },
  setShareURI: function (e) {
    e.preventDefault();
    var path = $(this).attr('href') + encodeURIComponent(location.href);
    window.open(path, 'Share Test Result', 'height=350,width=500,resizable=1');
  },
  clearResultView: function () {
    this.remove();
  },
  render: function () {
    var data = prettify(this.model.attributes);
    util.processData(data);
    this.$el.html(tempList({data: [data]}));
    this.renderPieChart();
    return this;
  },
  renderPieChart: function () {
    Highcharts.setOptions({
      lang: {thousandsSep: ','}
    });
    if (!$('#js-prop-data').html()) return;
    var results = JSON.parse($('#js-prop-data').html());
    results.forEach(function (result, index) {
      console.log(result);
      $('#js-prop-chart' + index).highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          spacing: [0, 0, 10, 0]
        },
        credits: {
          enabled: false
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
          data: result
        }]
      });
    });
  }
});