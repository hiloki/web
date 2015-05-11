var util = require('../../lib/util.js');

module.exports = Parse.View.extend({
  el: '#js-searchView',
  initialize: function () {
    this.$query = $('#js-query');
    this.$compare = $('#js-compare');
    this.$progress = $('#js-progress');
    this.setQuery();
  },
  events: {
    'keypress #js-query': 'moveOnEnter',
    'click #js-search': 'moveResultPage',
    'change .js-checkbox': 'inputTestId',
    'click #js-compare': 'startComparison'
  },
  startComparison: function() {
    var id1 = $('#js-id1').val();
    var id2 = $('#js-id2').val();
    var query = '/compare?id1='  + id1 + '&id2='+ id2;
    this.$compare.attr('href', query);
  },
  inputTestId: function() {
    var $checks = $('.js-checkbox');
    var $fileds = $('.js-input-filed');
    if ($checks.filter(':checked').length === 2) {
      $checks.not(':checked').prop('disabled', true);
    } else {
      $checks.prop('disabled', false);
    }
    $fileds.each(function(index){
      if(!$checks.filter(':checked')[index]) {
        $(this).val('');
      } else {
        $(this).val($checks.filter(':checked')[index].id);
      }
    });
  },
  setQuery: function() {
    if(!window.location.search) return;
    var query = window.location.search.replace(/^\?q=/, '');
    this.$query.val(decodeURIComponent(query));
  },
  moveOnEnter: function (event) {
    if (event.which === util.ENTER_KEY) {
      this.moveResultPage();
    }
  },
  moveResultPage: function () {
    this.$progress.addClass('is-loading');
    var query = this.$query.val();
    var uri = '/search?q=' + encodeURIComponent(query);
    window.location = uri;
  }
});