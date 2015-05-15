var mysql = require('mysql');
var q = require('q');

var pool  = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'givery'
});

var findById = function (id) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'select * from users where id =' + id;
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                return deferred.reject();
            }
            deferred.resolve(results[0]);
        });
    });
    return deferred.promise;
};

var findOneByEmail = function (email) {
    var deferred = q.defer();
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return deferred.reject();
        }
        var sql = 'select * from users where email="' + email + '" limit 1';
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                return deferred.reject();
            }
            deferred.resolve(results[0]);
        });
    });
    return deferred.promise;
};

module.exports = {
    findById: findById,
    findOneByEmail: findOneByEmail
};