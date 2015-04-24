$(function () {

  var _ = require('underscore');
  var prettify = require('stylestats/lib/prettify.js');
  var order = require('stylestats/assets/aliases.json');

  var util = require('./util.js');
  var templateList = require('../template/list.hbs');
  var templateColor = require('../template/color.hbs');
  var templateFont = require('../template/font.hbs');

  var APP_ID = "6xDZRme9sj9QV5hnZgzN0EqDS6H6enwJ6FlbzGbR";
  var JS_KEY = "ZdTWdw6CQ1tupvwfJqcojcxqPFQmwLqqxamkZT4b";

  Parse.$ = jQuery;
  Parse.initialize(APP_ID, JS_KEY);

  var param = {};

  // Router
  // =======================
  var Workspace = Parse.Router.extend({
    routes: {
      'results/:id': 'results'
    },
    results: function (id) {
      var rawData = JSON.parse($('#js-result').text());
      var data = {};
      Object.keys(order).forEach(function (key) {
        if (rawData[key]) {
          data[key] = rawData[key];
        }
      });
      result.set(data);
    }
  });


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
          console.log('SAVE DONE!!', object.id);
          router.navigate('/results/' + object.id, {trigger: false});
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
    el: '#js-resultView',
    initialize: function () {
      this.model.on('change', this.render, this);
      this.$el.on('click', '.js-share', this.setShareURI);
    },
    processData: function (data) {
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
      this.$el.html(templateList({results: data}));
      return this;
    }
  });

  new OperationView();
  new ResultView();
  var router = new Workspace();
  Parse.history.start({pushState: true});

});
