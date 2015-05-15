var express = require('express');
var UserDao = require('../../dao/user.dao.js');
var passport = require('passport');
var auth = require('./auth.service');
var bodyParser = require('body-parser');

// Passport Configuration
require('./auth.passport').setup(UserDao);

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();

router.post('/login', urlencodedParser, function(req, res, next) {
  return passport.authenticate('local', function (err, user, info) {
    var error = err || info;

    // Returning code 500 plus reason (wrong email or wrong password)
    if (error) {
      return res.json(200, {code:500, message: error});
    }

    if (!user) {
      return res.json(404, {message: 'Something went wrong, please try again.'});
    }

    //generating the token
    var token = auth.signToken(user.id);
    var userData = {
      id : user.id,
      name : user.name,
      group_id : user.group_id
    };
    return res.json({code:200, user: userData, token: token});
  })(req, res, next);
});

module.exports = router;