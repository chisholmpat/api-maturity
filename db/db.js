var opts = null;
var devEnv = true;

if(!devEnv){
    opts = {
        host: 'us-cdbr-azure-southcentral-e.cloudapp.net',
        user: 'b8f6c834853270',
        password: 'd5252709',
        database: 'API-Maturity',
        multipleStatements: true,
        connectionLimit: 1
    }
}
else{
  opts = {
      host: 'us-cdbr-iron-east-03.cleardb.net',
      user: 'bbcabd11525ed5',
      password: '102fb0ce',
      database: 'ad_a9e53e0371a808b',
      multipleStatements: true,
      connectionLimit: 1
  }
}


exports.knex = require('knex')({
    client: 'mysql',
    connection: opts,
    pool: {
        min: 0
    }
});
