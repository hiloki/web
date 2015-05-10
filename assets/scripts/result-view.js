var tempList = require('../../views/partials/list.hbs');
var prettify = require('stylestats/lib/prettify.js');
var util = require('../../lib/util.js');

module.exports = Parse.View.extend({
  el: '#js-resultView',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.$el.on('click', '.js-share', this.setShareURI);
    this.renderPieChart();
    this.renderColumnChart();
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
    if (!$('#js-props-data').html()) return;
    var results = JSON.parse($('#js-props-data').html());
    results.forEach(function (result, index) {
      $('#js-prop-chart' + index).highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          spacing: [0, 0, 10, 0]
        },
        credits: {enabled: false},
        colors: ['#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D'],
        title: false,
        tooltip: {
          borderRadius: 3,
          borderWidth: 0,
          backgroundColor: 'rgba(117, 117, 117, 0.9)',
          shadow: false,
          style: {color: '#fff'},
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
  },
  renderColumnChart: function () {
    if (!$('#js-sizes-data').html()) return;
    var results = JSON.parse($('#js-sizes-data').html());
    console.log(results);
    $('#js-sizes-chart').highcharts({
      chart: {
        type: 'column',
        spacing: [40, 20, 20, 20]
      },
      credits: {enabled: false},
      colors: ['#80DEEA', '#FFF59D'],
      title: false,
      xAxis: {
        categories: results[3],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Size (Byte)'
        }
      },
      tooltip: {
        borderRadius: 3,
        borderWidth: 0,
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        shadow: false,
        style: {color: '#fff'},
        headerFormat: '{point.key}<ul>',
        pointFormat: '<li><span style="color:{series.color};">■</span>' + '<b> {point.y}Byte</b></li>',
        footerFormat: '</ul>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: results[2][0],
        data: results[0]

      }, {
        name: results[2][1],
        data: results[1]
      }]
    });
  }
});