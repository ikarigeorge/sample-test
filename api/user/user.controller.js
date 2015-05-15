EventsDao = require('../../dao/events.dao');
AttendsDao = require('../../dao/attends.dao');
_ = require('lodash');

var STUDENT_GROUP = 1;

/**
 * Gets the list of events when valid parameters are passed
 * @param req
 * @param res
 * @returns {*|ServerResponse}
 */
var getEvents = function (req, res) {
    if (_.isEmpty(req.query) || _.isUndefined(req.query.from) || (!_.isUndefined(req.query.limit) && req.query.limit < 1)) {
        return res.send(400);
    }

    var date = req.query.from;
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 10000000;

    EventsDao.getEvents(date, limit, offset)
    .then(function(results) {
       res.json(200, {code:200, events:results});
    }, function (err) {
        return done(err);
    });

};

/**
 * Reserves/Unreserves and event when a student is logged
 * @param req
 * @param res
 * @returns {*|ServerResponse}
 */
var reserveEvent = function (req, res) {
    if (!req.user) {
        return res.json(200, {code:401, message: "Please login"});
    }
    if (req.user.group_id !== STUDENT_GROUP) {
        return res.json(200, {code:401, message: "Only students can reserve and event"});
    }
    if (req.body.reserve === "true") {
       AttendsDao.addAttendant(req.user.id, req.body.event_id)
       .then(function() {
           res.json(200, {code:200});
       }, function (err) {
               return res.json(200, {code:501, message: err});
       });
    }
    else {
       AttendsDao.removeAttendant(req.user.id, req.body.event_id)
       .then(function() {
           res.json(200, {code:200});
       }, function (err) {
               return res.json(200, {code:502, message: err});
       });
    }


};

module.exports = {
    events: getEvents,
    reserve: reserveEvent
};