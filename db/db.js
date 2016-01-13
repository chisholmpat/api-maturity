var opts = null;

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
                multipleStatements: true
            }
        }
    }
} else {
    opts = {
        host: 'us-cdbr-iron-east-03.cleardb.net',
        user: 'bbcabd11525ed5',
        password: '102fb0ce',
        database: 'ad_a9e53e0371a808b',
        multipleStatements: true,
        connectionLimit: 1
    }, pool: {
        min: 1,
        max: 1
    }
}

exports.knex = require('knex')({
    client: 'mysql',
    connection: opts
});
