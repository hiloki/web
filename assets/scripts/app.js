$(function () {

  var _ = require('underscore');
  var qs = require('querystring');
  var prettify = require('stylestats/lib/prettify.js');

  var REGEX_URL = require('./regex.js');
  var templateList = require('../template/list.hbs');
  var templateColor = require('../template/color.hbs');
  var templateFont = require('../template/font.hbs');

  var APP_ID = "6xDZRme9sj9QV5hnZgzN0EqDS6H6enwJ6FlbzGbR";
  var JS_KEY = "ZdTWdw6CQ1tupvwfJqcojcxqPFQmwLqqxamkZT4b";

  Parse.$ = jQuery;
  Parse.initialize(APP_ID, JS_KEY);

  var param = {};


  //  Result Model
  // =======================
  var Result = Parse.Object.extend('Result');
  var result = new Result();


  //  Operation View
  // =======================
  var OperationView = Parse.View.extend({
    model: result,
    el: '#js-operation',
    initialize: function () {
      this.$uri = $('#js-uri');
      this.$parse = $('#js-parse');
      this.$btnText = $('#js-text');
      this.csrfToken = $('#js-token').attr('content');
    },
    events: {
      'focus #js-uri': 'onFocusInput',
      'click #js-parse': 'requestParse'
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
      ga('send', 'event', 'Parse', 'Error');
    },
    requestParse: function () {
      var that = this;
      this.$parse.addClass('is-loading');
      this.$btnText.text('');

      var path = this.$uri.val();
      if (REGEX_URL.test(path)) {
        param.path = _.escape(path);
      } else {
        this.failParse();
        return;
      }

      var config =  {
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
        that.model.save(data).then(function(object) {
          console.log('SAVE DONE!!', object);
        });
      }).fail(function () {
        that.failParse();
        setTimeout(function () {
          // location.reload();
        }, 750);
      });
    }
  });


  //  Result View
  // =======================
  var ResultView = Parse.View.extend({
    model: result,
    el: '#js-result',
    initialize: function () {
      this.model.on('sync', this.render, this);
    },
    render: function () {

      console.log('model', this.model);
      console.log('el', this.el);

      var data = prettify(this.model.attributes);
      window.history.pushState({
        uri: param.path
      }, 'StyleStats', '?uri=' + encodeURIComponent(param.path));

      var sharePath = encodeURIComponent('http://www.stylestats.org/?uri=' + param.path);

      Object.keys(data).forEach(function (key) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].replace(/\n/g, '<br>');
        }
      });
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

      this.$el.html(templateList({
        results: data,
        path: sharePath
      }));
      $(document).scrollTop(0);
      ga('send', 'event', 'Parse', 'Success');
      return this;
    }
  });

  new OperationView();
  new ResultView();

});
