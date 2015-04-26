var _ = require('underscore');
var util = require('./util.js');

module.exports = Parse.View.extend({
  el: '#js-operation',
  initialize: function () {
    this.$uri = $('#js-uri');
    this.$parse = $('#js-parse');
    this.$progress = $('#js-progress');
    this.csrfToken = $('#js-token').attr('content');
  },
  events: {
    'focus #js-uri': 'onFocusInput',
    'click #js-parse': 'requestParse'
  },
  onFocusInput: function (e) {
    this.$parse.prop('disabled', false).removeClass('is-disabled');
  },
  failParse: function () {
    this.$parse
      .prop('disabled', true)
      .addClass('is-disabled');
    this.$progress.removeClass('is-loading');
  },
  requestParse: function () {
    var that = this;
    var param = {};
    var path = this.$uri.val();
    if (util.URL.test(path)) {
      param.path = _.escape(path);
    } else {
      this.failParse();
      return;
    }
    this.$progress.addClass('is-loading');
    var config = {
      type: 'post',
      url: '/parse',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', that.csrfToken);
      },
      data: param
    };

    $.ajax(config).done(function (data) {
      that.$progress.removeClass('is-loading');
      that.model.set(data);
      that.model.save().then(function (object) {
        var title = object.get('paths')[0] + ' - ' + object.createdAt;
        $('title').text('StyleStats Test Result | ' + title);
        global.router.navigate('/results/' + object.id, {trigger: false});
      });
    }).fail(function () {
      that.failParse();
      setTimeout(function () {
        // location.reload();
      }, 750);
    });
  }
});
