var util = require('../../lib/util.js');

module.exports = Parse.View.extend({
  el: '#js-searchView',
  initialize: function () {
    this.$query = $('#js-query');
    this.$search = $('#js-search');
    this.$progress = $('#js-progress');
    this.setQuery();
  },
  events: {
    'keypress #js-query': 'moveOnEnter',
    'click #js-search': 'moveResultPage'
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