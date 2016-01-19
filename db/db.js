var opts = null;

    opts = {
        host: 'us-cdbr-azure-southcentral-e.cloudapp.net',
        user: 'b8f6c834853270',
        password: 'd5252709',
        database: 'API-Maturity',
        multipleStatements: true,
        connectionLimit: 1
    }


exports.knex = require('knex')({
    client: 'mysql',
    connection: opts,
    pool: {
        min: 0
    }
});
