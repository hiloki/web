var util = require('../../lib/util.js');

module.exports = Parse.View.extend({
  el: '#js-searchView',
  initialize: function () {
    this.$query = $('#js-query');
    this.$compare = $('#js-compare');
    this.$progress = $('#js-progress');
    this.$checks = $('.js-checkbox');
    this.$fileds = $('.js-input-filed');
    this.setQuery();
    this.$checks.prop('checked', false);
    this.$fileds.val('');
  },
  events: {
    'keypress #js-query': 'moveOnEnter',
    'click #js-search': 'moveResultPage',
    'change .js-checkbox': 'inputTestId',
    'input .js-input-filed': 'activateBtn',
    'click #js-compare': 'startComparison'
  },
  activateBtn: function () {
    var id1 = $('#js-id1').val();
    var id2 = $('#js-id2').val();
    if (id1 !== '' && id2 !== '') {
      this.$compare.removeClass('disabled');
    } else {
      this.$compare.addClass('disabled');
    }
  },
  startComparison: function () {
    var id1 = $('#js-id1').val();
    var id2 = $('#js-id2').val();
    var query = '/compare?id1=' + id1 + '&id2=' + id2;
    this.$compare.attr('href', query);
  },
  inputTestId: function () {
    var that = this;
    if (this.$checks.filter(':checked').length === 2) {
      this.$checks.not(':checked').prop('disabled', true);
      this.$compare.removeClass('disabled');
    } else {
      this.$checks.prop('disabled', false);
      this.$compare.addClass('disabled');
    }
    this.$fileds.each(function (index) {
      if (!that.$checks.filter(':checked')[index]) {
        $(this).val('');
      } else {
        $(this).val(that.$checks.filter(':checked')[index].id);
      }
    });
  },
  setQuery: function () {
    if (!window.location.search) return;
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