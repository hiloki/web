var qs = require('querystring');
var prettify = require('stylestats/lib/prettify.js');
var templateList = require('../template/list.hbs');
var templateColor = require('../template/color.hbs');
var templateFont = require('../template/font.hbs');

var REGEX_URL = require('./regex.js');

$(function () {

  // tabs and related views
  var $tabs = $('#js-tabs').find('li');
  var $tabContents = $('#js-tabContents').find('li');

  // contents of uri, upload, and input
  var $uriElements = $('.js-tab-uri');
  var $uploadElements = $('.js-tab-upload');
  var $inputElements = $('.js-tab-input');

  switch (location.hash) {
    case '#upload':
      // remove URI tab focus
      $uriElements.removeClass('is-active');

      // activate upload tab
      $uploadElements.addClass('is-active');
      break;
    case '#input':
      // remove URI tab focus
      $uriElements.removeClass('is-active');

      // activate input tab
      $inputElements.addClass('is-active');
      break;
    default:
      // URI tab is selected
      break;
  }

  $tabs.on('click', function () {

    // enable parse button
    $parse.removeAttr('disabled').removeClass('c-button-m-danger');
    $buttonText.text('Parse');

    var $this = $(this);
    if (!$this.hasClass('is-active')) {

      // if clicked tab is not active,
      // remove tab and related view focus
      $tabs.removeClass('is-active');
      $tabContents.removeClass('is-active');

      // get mode from clicked tab
      var mode = $this.attr('data-mode');
      switch (mode) {
        case 'uri':
          $uriElements.addClass('is-active');
          break;
        case 'upload':
          $uploadElements.addClass('is-active');
          break;
        case 'input':
          $inputElements.addClass('is-active');
          break;
      }
    }
  });

  var csrfToken = $('meta[name="_csrf"]').attr('content');
  var $uri = $('#js-uri');
  var $upload = $('#js-upload');
  var $input = $('#js-input');
  var $parse = $('#js-parse');
  var $buttonText = $('#js-text');
  var $view = $('#js-results');

  $uri.on('focus', onFocusInput);
  $input.on('focus', onFocusInput);

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

  // loaded file strings
  var loadedFiles = [];
  $upload.on('change', function () {
    loadedFiles = [];
    _.each(this.files, function (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        if (e.target.result) {
          loadedFiles.push(e.target.result);
        }
      };
      reader.readAsText(file, 'utf-8');
    });
  });

  $parse.on('click', function () {

    // set indicator
    $parse.addClass('is-loading');
    $buttonText.text('');

    // request parameter
    var string;
    var param = {};
    var URL = REGEX_URL;

    var mode = $tabs.filter('.is-active').attr('data-mode');
    switch (mode) {
      case 'uri':
        var path = $uri.val();
        if (URL.test(path)) {
          param.path = _.escape(path);
        } else {
          disableButton('Undefined: ' + mode);
          return;
        }
        break;
      case 'upload':
        string = loadedFiles.join('');
        if (string) {
          param.css = _.escape(string);
        } else {
          disableButton('Undefined: ' + mode);
          return;
        }
        break;
      case 'input':
        string = $input.val();
        if (string) {
          param.css = _.escape(string);
        } else {
          disableButton('Undefined: ' + mode);
          return;
        }
        break;
    }

    var errorPath = param.path || 'Raw data';
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

      if (data['Unique Colors'] !== 'N/A') {
        data['Unique Colors'] = templateColor({
          color: data['Unique Colors'].split(/\n/)
        });
      }

      if (data['Unique Font Families'] !== 'N/A') {
        data['Unique Font Families'] = templateFont({
          font: data['Unique Font Families'].split(/\n/)
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
        location.reload();
      }, 750);
    });
  });

  var result = qs.parse(location.search.replace('?', ''));
  if (result.uri) {
    $inputElements.removeClass('is-active');
    $uploadElements.removeClass('is-active');
    $uriElements.addClass('is-active');
    $uri.val(result.uri);
    $parse.trigger('click');
  } else {
    $uri.one('focus', function () {
      $(this).val('');
    });
  }
});