$(function () {
  var util = require('./util.js');

  Parse.$ = jQuery;
  Parse.initialize(util.ID, util.KEY);


  // Router
  // =======================
  var Workspace = require('./router.js');

  //  Model
  // =======================
  var Result = Parse.Object.extend('Result');
  var result = new Result();
  global.result = result;

  //  View
  // =======================
  var OperationView = require('./operation-view.js');
  var ResultView = require('./result-view.js');

  new OperationView({model: result});
  new ResultView({model: result});

  global.router = new Workspace();
  Parse.history.start({pushState: true});
});
(function (window, $) {

  $(function() {


    $('.ripple').on('click', function (event) {
      event.preventDefault();

      var $div = $('<div/>'),
        btnOffset = $(this).offset(),
        xPos = event.pageX - btnOffset.left,
        yPos = event.pageY - btnOffset.top;



      $div.addClass('ripple-effect');
      var $ripple = $(".ripple-effect");

      $ripple.css("height", $(this).height());
      $ripple.css("width", $(this).height());
      $div
        .css({
          top: yPos - ($ripple.height()/2),
          left: xPos - ($ripple.width()/2),
          background: $(this).data("ripple-color")
        })
        .appendTo($(this));

      window.setTimeout(function(){
        $div.remove();
      }, 2000);
    });

  });

})(window, jQuery);