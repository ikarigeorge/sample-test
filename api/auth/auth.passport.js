var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

/**
 * Configuring passport to receive the email and password params, comparing the sha1 password in case a valid email is found
 * @param UserDao
 */
exports.setup = function (UserDao) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      UserDao.findOneByEmail(email.toLowerCase())
      .then(function (user) {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        if (user.password !== crypto.createHash('sha1').update(password).digest('hex')) {
          return done(null, false, { message: 'Verify your password' });
        }
        return done(null, user);
      }, function (err) {
        return done(err);
      });
    }
  ));
};