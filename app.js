var express = require('express');
var http = require('http');

var app = express();

var server = http.createServer(app);
require('./routes')(app);
app.use(function (err, req, res, next) {
    // only handle `next(err)` calls
    console.log('Route error');
    next(err);
});

// Start server
server.listen(3000, function () {
    console.log('Server listening...');
});

// Exposing app
var exports;
exports = module.exports = app;