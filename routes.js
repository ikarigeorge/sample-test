module.exports = function(app) {

  // Routes
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/companies', require('./api/companies'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|app|assets)/*')
    .get(function(req, res) {
      res.send(404);
    });
};