var _ = require('underscore');
var qs = require('querystring');
var prettify = require('stylestats/lib/prettify.js');

var REGEX_URL = require('./regex.js');
var templateList = require('../template/list.hbs');
var templateColor = require('../template/color.hbs');
var templateFont = require('../template/font.hbs');

Parse.$ = jQuery;
Parse.initialize("6xDZRme9sj9QV5hnZgzN0EqDS6H6enwJ6FlbzGbR", "ZdTWdw6CQ1tupvwfJqcojcxqPFQmwLqqxamkZT4b");

$(function () {

  // Model
  var Result = Parse.Object.extend('Result');
  var result = new Result();

  var $uri = $('#js-uri');
  var $parse = $('#js-parse');
  var $buttonText = $('#js-text');
  var $view = $('#js-results');
  var csrfToken = $('meta[name="_csrf"]').attr('content');

  function onFocusInput(e) {
    $parse.removeAttr('disabled').removeClass('c-button-m-danger');
    $buttonText.text('Parse');
  }

  function disableButton(analyticsPath) {
    $parse.attr('disabled', 'disabled').removeClass('is-loading').addClass('c-button-m-danger');
    $buttonText.text('Failed!');
    // send analytics data
    ga('send', 'event', 'Parse', 'Error', analyticsPath);
  }

  $uri.on('focus', onFocusInput);

  $parse.on('click', function () {
    // set indicator
    $parse.addClass('is-loading');
    $buttonText.text('');

    // request parameter
    var string;
    var param = {};
    var URL = REGEX_URL;
    var path = $uri.val();
    if (URL.test(path)) {
      param.path = _.escape(path);
    }

    var errorPath = param.path;

    $.ajax({
      type: 'post',
      url: '/parse',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', csrfToken);
      },
      data: param
    }).done(function (data) {

      data = prettify(data);

      var sharePath = false;
      if (param.path) {
        window.history.pushState({
          uri: param.path
        }, 'StyleStats', '?uri=' + encodeURIComponent(param.path));
        sharePath = encodeURIComponent('http://www.stylestats.org/?uri=' + param.path);
      }
      // set up parse button text
      $parse.removeClass('is-loading');
      $buttonText.text('Parse');

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

      // render result with compiled html
      $view.html(templateList({
        results: data,
        path: sharePath
      }));

      // scroll to window top
      $(document).scrollTop(0);

      ga('send', 'event', 'Parse', 'Success');
    }).fail(function () {
      // disable parse button
      disableButton(errorPath);
      // token generated
      setTimeout(function () {
        //location.reload();
      }, 750);
    });
  });

});