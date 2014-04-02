$(function() {
  
  var $tabs = $('#js-tabs').find('li');
  var $tabContents = $('#js-tabContents').find('li');

  var $uriElements = $('.js-tab-uri');
  var $uploadElements = $('.js-tab-upload');
  var $inputElements = $('.js-tab-input');
  
  switch (location.hash) {
    case '#upload':
      $uriElements.removeClass('is-active');
      $uploadElements.addClass('is-active');
      break;
    case '#input':
      $uriElements.removeClass('is-active');
      $inputElements.addClass('is-active');
      break;
  }

  $tabs.on('click', function () {
    var $this = $(this);
    if (!$this.hasClass('is-active')) {
      $tabs.removeClass('is-active');
      $tabContents.removeClass('is-active');

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

  var $uri = $('#js-uri');
  var $upload = $('#js-upload');
  var $input = $('#js-input');
  var $parse = $('#js-parse');
  var $text = $('#js-text');
  var $view = $('#js-view');

  $uri.on('focus', onFocusInput);
  $input.on('focus', onFocusInput);

  function onFocusInput (e) {
    $parse.removeAttr('disabled').removeClass('is-failed');
    $text.text('Parse');
  }

  var resultTemplate = $('#js-tmpResult').html();
  var resultCompiler = _.template(resultTemplate);
  
  var colorTemplate = $('#js-tmpColor').html();
  var colorCompiler = _.template(colorTemplate);

  var loadedFiles = [];
  $upload.on('change', function() {
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

  $parse.on('click', function() {

    $parse.addClass('is-loading');
    $text.text('');

    var param = {};

    var mode = $tabs.filter('.is-active').attr('data-mode');
    switch (mode) {
      case 'uri':
        var path = $uri.val();
        if (path) {
          param.path = path;
        }
        break;
      case 'upload':
        var string = loadedFiles.join('');
        if (string) {
          param.css = string;
        }
        break;
      case 'input':
        var string = $input.val();
        if (string) {
          param.css = string;
        }
        break;
    }

    $.ajax({
      type: 'post',
      url: '/parse',
      data: param
    }).done(function(data) {

      $text.text('Parse');
      $parse.removeClass('is-loading');

      // uniqueColor
      data.filter(function (item) {
        return item.name === 'uniqueColor';
      }).forEach(function (item) {
        item.value = colorCompiler({
          colors: item.value || []
        });
      });

      $view.html(resultCompiler({
        results: data
      }));

      $(document).scrollTop(0);

    }).fail(function() {
      $text.text('Failed!');
      $parse.attr('disabled', 'disabled').removeClass('is-loading').addClass('is-failed');
    });
  });
});



    