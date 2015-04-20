require('newrelic');
var forever = require('forever');

var child = new (forever.Monitor)('main.js', {
  max: 3,
  silent: false,
  options: []
});

//child.on('exit', this.callback);
child.start();

forever.startServer(child);