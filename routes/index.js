module.exports = function (request, response) {
  response.render('index', {
    title: 'StyleStats is an evaluating tool for writing better CSS.'
  });
};