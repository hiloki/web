(function() {
    $('<img>').attr('src', '/images/loading-bars.svg');

    $(document).ready(function() {
        console.log();
        if (location.hash === "#upload") {
            $('#js-tabs > li').each(function() {
                $(this).removeClass('is-active');
            });
            $('[href="#upload"]').parent().addClass('is-active');
            $('#js-tabContents > li').each(function() {
                $(this).removeClass('is-active');
            });
            $('#js-upload').parent().addClass('is-active');
        }
        if (location.hash === "#input") {
            $('#js-tabs > li').each(function() {
                $(this).removeClass('is-active');
            });
            $('[href="#input"]').parent().addClass('is-active');
            $('#js-tabContents > li').each(function() {
                $(this).removeClass('is-active');
            });
            $('#js-input').parent().addClass('is-active');
        }
    });
    // Tab Change
    $('#js-tabs > li').on('click', function() {
        $('#js-tabs > li').each(function() {
            $(this).removeClass('is-active');
        });
        $(this).addClass('is-active');

        $('#js-tabContents > li').each(function() {
            $(this).removeClass('is-active');
        });
        var content = '#js-' + $(this).data('tabs');
        $(content).parent().addClass('is-active');
    });


    var tmpl = $('#js-tmpResult').html();
    var compiled = _.template(tmpl);

    $('#js-parse').on('click', function() {
        var $that = $(this);

        var mode = '';
        $('#js-tabs > li').each(function() {
            if ($(this).hasClass('is-active')) {
                mode = $(this).data('tabs');
            }
        });
        var paths;
        var selector = '#js-' + mode;
        if ($(selector).val()) {
            paths = $(selector).val();
        } else {
            window.alert('No Input.');
            return false;
        }

        $that.text('').addClass('is-loading');

        $.ajax({
            type: 'POST',
            url: '/parse',
            data: {
                path: paths
            }
        }).done(function(data) {

            $that.text('Parse').removeClass('is-loading');

            $('#js-view').html(compiled({
                results: data
            }));

        }).fail(function(data) {
            $that.text('Parse').removeClass('is-loading');
            $('#js-view').html(data);
        });
    });


}());