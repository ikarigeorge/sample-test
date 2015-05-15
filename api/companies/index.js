var express = require('express');
var controller = require('./companies.controller');
var auth = require('../auth/auth.service');
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();

router.post('/events', urlencodedParser, auth.isAuthenticated(), controller.events);

module.exports = router;
