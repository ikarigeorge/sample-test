EventsDao = require('../../dao/events.dao');
AttendsDao = require('../../dao/attends.dao');
_ = require('lodash');

var COMPANIES_GROUP = 2;

/**
 * Function to retrieve the events and the attendants, only available for companies
 * @param req
 * @param res
 * @returns {*|ServerResponse}
 */
var getEvents = function (req, res) {
    if (!req.user) {
        return res.json(200, {code:401, message: "Please login"});
    }
    //Check type of user
    if (req.user.group_id !== COMPANIES_GROUP) {
        return res.json(200, {code:401, message: "Only companies can see this list"});
    }
    //Wrong parameters
    if (_.isEmpty(req.body) || _.isUndefined(req.body.from) || (!_.isUndefined(req.body.limit) && req.body.limit < 1)) {
        return res.send(400);
    }

    var date = req.body.from;
    var offset = req.body.offset || 0;
    var limit = req.body.limit || 10000000;

    EventsDao.getEventsCompanies(date, limit, offset, req.user.id)
    .then(function(results) {
        res.json(200, {code:200, events:results});
    }, function (err) {
        return done(err);
    });
};

module.exports = {
    events: getEvents
};
