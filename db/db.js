var opts = null;
var devEnv = false;

// Check to see if we're in Bluemix environment.
if (process.env.VCAP_SERVICES) {

    var services = JSON.parse(process.env.VCAP_SERVICES);

    for (var svcName in services) 
        if (svcName.match(/^user-provided/)) 
            opts = services[svcName][0].credentials;    

} else {

    // Conditionally set the database connection details
    // based on whether we're in development or production.
    // The connection details, username and password are 
    // stored locally in a properties file.

    if (process.env.DEV_ENV) {
        opts = {
            host: 'us-cdbr-azure-southcentral-e.cloudapp.net',
            user: process.env.PROD_USER,
            password: process.env.PROD_PASSWORD,
            database: 'API-Maturity',
            multipleStatements: true,
            connectionLimit: 1
        }
    } else {
        opts = {
            host: 'us-cdbr-iron-east-03.cleardb.net',
            user: process.env.DEV_USER,
            password: process.env.DEV_PASSWORD,
            database: 'ad_a9e53e0371a808b',
            multipleStatements: true,
            connectionLimit: 1
        }
    }
}

// The pool is set to min:0 due to an issue
// with Knex's handling of pools.
exports.knex = require('knex')({
    client: 'mysql',
    connection: opts,
    pool: {
        min: 0
    }
});
