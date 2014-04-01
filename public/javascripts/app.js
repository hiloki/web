$('#js-parse').on('click', function() {
    var $that = $(this);
    $that.text('').addClass('is-loading');
    var url = $('#js-url').val();
    $.ajax({
        type: 'POST',
        url: '/parse',
        data: {
            path: url
        }
    }).done(function(result) {
        $that.text('Parse').removeClass('is-loading');
        alert('Loaded!');
        console.log(result);
    });
});