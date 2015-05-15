var mysql = require('mysql');
var q = require('q');

var pool  = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'givery'
});

var addAttendant = function (user, event) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'insert into attends (user_id, event_id) values(' + user + ',' + event + ')';
        connection.query(sql, [], function(err, result) {
            connection.release();
            if(err) {
                return deferred.reject(err.errno === 1062 ? 'Cannot reserve already reaserved event' : err);
            }
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

var removeAttendant = function (user, event) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'delete from attends where user_id=' + user + ' and event_id=' + event;
        connection.query(sql, [], function(err, result) {
            connection.release();
            if(err || result.affectedRows === 0) {
                return deferred.reject(err || 'Cannot unreserve not reaserved event');
            }
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

module.exports = {
    addAttendant: addAttendant,
    removeAttendant: removeAttendant
};
