$(function () {
  var util = require('../../lib/util.js');

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
  var SearchView = require('./search-view.js');

  new OperationView({model: result});
  new ResultView({model: result});
  new SearchView();

  global.router = new Workspace();
  Parse.history.start({pushState: true});
});
