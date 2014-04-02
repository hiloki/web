(function() {
    $('<img>').attr('src', '/images/loading-bars.svg');

    // Hash Change
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


    // Focus
    $('#js-uri, #js-input').on('focus', function() {
        $('#js-parse')
            .removeAttr('disabled')
            .removeClass('is-failed');
        $('#js-text').text('Parse');
    });

    var tmpl = $('#js-tmpResult').html();
    var compiled = _.template(tmpl);

    // File.api 
    $('#js-upload').on('change', function() {
        var files = $(this)[0].files;

        processFiles(files, function(src) {
            var a = document.createElement("a");
            a.textContent = "Received data URL in " + (Date.now() - now) + "ms";
            a.href = src;
            a.target = "_blank";
            document.body.appendChild(a);
            document.body.appendChild(document.createElement("br"));
        });

        function processFiles(files, cb) {

            if (!FileReaderSyncSupport) {
                return;
            }

            var syncWorker = makeWorker(
                document.getElementById('worker-script').textContent
            );

            if (syncWorker) {
                syncWorker.onmessage = function(e) {
                    cb(e.data.result);
                };

                Array.prototype.forEach.call(files, function(file) {
                    syncWorker.postMessage(file);
                });
            }
        }

    });

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
        $('#js-text').text('');
        $that.addClass('is-loading');

        $.ajax({
            type: 'POST',
            url: '/parse',
            data: {
                path: paths
            }
        }).done(function(data) {
            console.log(data);
            $('#js-text').text('Parse');
            $that.removeClass('is-loading');

            // uniqueColor
            _.each(data, function(item) {
                if (item.name === 'uniqueColor') {
                    var trimVal = '';
                    _.each(item.value, function(color) {
                        trimVal += '<span class="c-colorBox" style="background-color:' + color + '"></span><em>' + color + '</em><br>'
                    });
                    item.value = trimVal;
                }
            });


            $('#js-view').html(compiled({
                results: data
            }));

            $(document).scrollTop(0);

        }).fail(function(data) {
            $('#js-text').text('Failed!');
            $that.attr('disabled', 'true')
                .removeClass('is-loading')
                .addClass('is-failed');
        });
    });


}());