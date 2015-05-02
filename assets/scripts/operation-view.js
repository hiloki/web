var _ = require('underscore');
var util = require('./util.js');

module.exports = Parse.View.extend({
  el: '#js-operation',
  initialize: function () {
    this.$uri = $('#js-uri');
    this.$parse = $('#js-parse');
    this.$progress = $('#js-progress');
    this.csrfToken = $('#js-token').attr('content');
    $('.ripple').on('click', this.rippleEffect);
    $('.js-favicon').error(this.replaceFavicon);
  },
  events: {
    'focus #js-uri': 'enableInput',
    'keydown #js-uri': 'enableInput',
    'keypress #js-uri': 'requestOnEnter',
    'click #js-parse': 'requestParse'
  },
  replaceFavicon: function () {
    $(this).attr({src: '/img/favicon.png'});
  },
  enableInput: function (e) {
    this.$parse.prop('disabled', false).removeClass('is-disabled');
  },
  failParse: function () {
    this.$parse
      .prop('disabled', true)
      .addClass('is-disabled');
    this.$progress.removeClass('is-loading');
    ga('send', 'event', 'Parse', 'Error', this.$uri.val());
  },
  requestOnEnter: function (event) {
    if (event.which === util.ENTER_KEY) {
      this.requestParse();
    }
  },
  requestParse: function () {
    var that = this;
    var param = {};
    var path = this.$uri.val();
    if (path.search(/^http(s?):\/\//) === -1) {
      path = 'http://' + path;
    }
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
        ga('send', 'pageview');
      });
      ga('send', 'event', 'Parse', 'Success');
    }).fail(function () {
      that.failParse();
      setTimeout(function () {
        // location.reload();
      }, 750);
    });
  },
  rippleEffect: function (event) {
    event.preventDefault();
    var $div = $('<div/>');
    var btnOffset = $(this).offset();
    var xPos = event.pageX - btnOffset.left;
    var yPos = event.pageY - btnOffset.top;
    $div.addClass('ripple-effect');
    var $ripple = $(".ripple-effect");
    $ripple.css("height", $(this).height());
    $ripple.css("width", $(this).height());
    $div.css({
      top: yPos - ($ripple.height() / 2),
      left: xPos - ($ripple.width() / 2),
      background: $(this).data("ripple-color")
    })
      .appendTo($(this).find('.inner'));
    window.setTimeout(function () {
      $div.remove();
    }, 2000);
  }
});
