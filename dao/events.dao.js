var mysql = require('mysql');
var q = require('q');

var pool  = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'givery'
});

var getEvents = function (date, limit, offset) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'select * from events where start_date > "' + date  + '" ORDER BY start_date limit ' + offset + ',' + limit;
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                return deferred.reject();
            }
            deferred.resolve(results);
        });
    });
    return deferred.promise;
};

var getEventsCompanies = function (date, limit, offset, user) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'select *,(select count(user_id) from attends where event_id=events.id) as number_of_attendees ' +
                  'from events where start_date > "' + date  + '" and user_id = ' + user + ' ' +
                  'order by start_date limit ' + offset + ',' + limit;
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                return deferred.reject();
            }
            deferred.resolve(results);
        });
    });
    return deferred.promise;
};

module.exports = {
    getEvents: getEvents,
    getEventsCompanies: getEventsCompanies
};
