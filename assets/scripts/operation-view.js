var _ = require('underscore');
var util = require('./util.js');

module.exports = Parse.View.extend({
  el: '#js-operation',
  initialize: function () {
    this.$uri = $('#js-uri');
    this.$parse = $('#js-parse');
    this.$btnText = $('#js-text');
    this.csrfToken = $('#js-token').attr('content');
    this.$uri.one('focus', this.clearURI);
  },
  events: {
    'focus #js-uri': 'onFocusInput',
    'click #js-parse': 'requestParse'
  },
  clearURI: function () {
    $(this).val('');
  },
  onFocusInput: function (e) {
    this.$parse.prop('disabled', false).removeClass('is-disabled');
    this.$btnText.text('Parse');
  },
  failParse: function () {
    this.$parse
      .prop('disabled', true)
      .removeClass('is-loading')
      .addClass('is-disabled');
    this.$btnText.text('Failed!');
  },
  requestParse: function () {
    var that = this;
    this.$parse.addClass('is-loading');
    this.$btnText.text('');

    var param = {};
    var path = this.$uri.val();
    if (util.URL.test(path)) {
      param.path = _.escape(path);
    } else {
      this.failParse();
      return;
    }

    var config = {
      type: 'post',
      url: '/parse',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', that.csrfToken);
      },
      data: param
    };

    $.ajax(config).done(function (data) {
      that.$parse.removeClass('is-loading');
      that.$btnText.text('Parse');
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
