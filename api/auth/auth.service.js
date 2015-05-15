var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var UserDao = require('../../dao/user.dao.js');

var TOKEN_SECRET = '12345';
var validateJwt = expressJwt({ secret: TOKEN_SECRET });

/**
 * Attaches the user data to the request if authenticated
 * Otherwise returns 401
 */
var isAuthenticated = function () {
    return compose()
        // Validate jwt
        .use(function (req, res, next) {
            // allow access_token to be passed through urlencoded
            if (req.body && req.body.hasOwnProperty('token') && req.body.token !== 'null') {
                req.headers.authorization = 'Bearer ' + req.body.token;
                validateJwt(req, res, next);
            } else {
                return next();
            }
        })
        // Attach user to request
        .use(function (req, res, next) {
            if (!req.user) {
                req.user = false;
                next();
            } else {
                UserDao.findById(req.user._id)
                .then(function (user) {
                    if (!user) {
                        req.user = false;
                        return next();
                    }
                    req.user = user;
                    next();
                }, function (err) {
                    return next(err);
                });
            }
        });
};

/**
 * Returns a jwt token signed by the app secret
 */
var signToken = function (id) {
    return jwt.sign({ _id: id }, TOKEN_SECRET, { expiresInMinutes: 60 * 5 });
};

/**
 * Export auth.service functions.
 */
module.exports = {
    isAuthenticated: isAuthenticated,
    signToken: signToken
};