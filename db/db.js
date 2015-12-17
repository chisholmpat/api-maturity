var opts = null;

var mysql = require('mysql');

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);

    for (var svcName in services) {
        if (svcName.match(/^cleardb/)) {
            var mysqlCreds = services[svcName][0]['credentials'];
            opts = {
                host: mysqlCreds.host,
                host: mysqlCreds.hostname,
                port: mysqlCreds.port,
                user: mysqlCreds.username,
                password: mysqlCreds.password,
                database: mysqlCreds.name,
                connectionLimit: 1
            }
        }
    }
} else {
    opts = {
        host: 'us-cdbr-iron-east-03.cleardb.net',
        user: 'bbcabd11525ed5',
        password: '102fb0ce',
        database: 'ad_a9e53e0371a808b',
        connectionLimit: 1
    }
}

var pool = mysql.createPool(opts);

// Get records from a city
exports.getPool = function () {
    return pool;
}

exports.callQuery = function( res, callback, sql, params){

console.log(sql);

// get a connection from the pool
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(err + sql);
        callback(res, err, results);
        return;
    }
    // make the query
    connection.query(sql, params, function (err, results) {
        connection.release();
        console.log(results)
        if (err + sql) {
            console.log(err);
            callback(res, err, results);
            return;
        }
        callback(res, err, results);
    });
})};


exports.callQueryWithNoCallBackOrParams = function(sql){

// get a connection from the pool
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err + sql);
            return;
        }
        // make the query
        connection.query(sql, [], function (err, results) {
            connection.release();
        ;
            if (err + sql) {
                console.log(err);
                return;
            }
        });
    })};
