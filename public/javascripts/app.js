$(function() {

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

    $tabs.on('click', function() {

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
    var $view = $('#js-view');

    $uri.on('focus', onFocusInput);
    $input.on('focus', onFocusInput);

    function onFocusInput(e) {
        $parse.removeAttr('disabled').removeClass('c-button-m-danger');
        $buttonText.text('Parse');
    }

    function escapeHTML(val) {
        return $('<div>').text(val).html();
    }

    // loaded file strings
    var loadedFiles = [];
    $upload.on('change', function() {
        loadedFiles = [];
        _.each(this.files, function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (e.target.result) {
                    loadedFiles.push(e.target.result);
                }
            };
            reader.readAsText(file, 'utf-8');
        });
    });

    // result template
    var resultTemplate = $('#js-tmpResult').html();
    var resultCompiler = _.template(resultTemplate);

    // color template
    var colorTemplate = $('#js-tmpColor').html();
    var colorCompiler = _.template(colorTemplate);

    $parse.on('click', function() {

        // set indicator
        $parse.addClass('is-loading');
        $buttonText.text('');

        // request parameter
        var param = {};

        var mode = $tabs.filter('.is-active').attr('data-mode');
        switch (mode) {
            case 'uri':
                var path = $uri.val();
                if (path) {
                    param.path = escapeHTML(path);
                }
                break;
            case 'upload':
                var string = loadedFiles.join('');
                if (string) {
                    param.css = escapeHTML(string);
                }
                break;
            case 'input':
                var string = $input.val();
                if (string) {
                    param.css = escapeHTML(string);
                }
                break;
        }
        $.ajax({
            type: 'post',
            url: '/parse',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', csrfToken);
            },
            data: param
        }).done(function(data) {

            // set up parse button text
            $parse.removeClass('is-loading');
            $buttonText.text('Parse');

            // replace "uniqueColor" items with compiled html
            data.filter(function(item) {
                return item.name === 'uniqueColor';
            }).forEach(function(item) {
                item.value = colorCompiler({
                    colors: item.value || []
                });
            });

            // render result with compiled html
            $view.html(resultCompiler({
                results: data
            }));

            // scroll to window top
            $(document).scrollTop(0);

        }).fail(function() {

            // disable parse button
            $parse.attr('disabled', 'disabled').removeClass('is-loading').addClass('c-button-m-danger');
            $buttonText.text('Failed!');

        });
    });
});