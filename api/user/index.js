var express = require('express');
var controller = require('./user.controller');
var auth = require('../auth/auth.service');
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();

router.post('/reserve', urlencodedParser, auth.isAuthenticated(), controller.reserve);
router.get('/events', controller.events);

module.exports = router;