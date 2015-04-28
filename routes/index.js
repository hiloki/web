module.exports = function (request, response) {
  response.render('index', {
    title: 'StyleStats - An evaluating tool for writing better CSS.'
  });
};