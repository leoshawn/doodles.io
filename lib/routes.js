var session = require('./handlers/session');
var render = require('./handlers/render');
var user = require('./handlers/user');
var passport = require('passport');
var doodle = require('./handlers/doodle');

module.exports = function (app) {

  app.get('/', function (req, res, next) {
    return res.redirect('/new');
  });
  app.get('/new', render.index);
  app.post('/new', doodle.new);
  app.get('/register', render.register);
  app.post('/register', user.register);
  app.get('/logout', session.logout);
  app.get('/login', render.login);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

}