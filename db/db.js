var opts = null;
var pool = null;
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
      }}}
   } else {
  		opts = {
  		host     : 'us-cdbr-iron-east-03.cleardb.net',
  		user     : 'bbcabd11525ed5',
  		password : '102fb0ce',
  		database : 'ad_a9e53e0371a808b',
      connectionLimit: 1
   }};

   var pool = mysql.createPool(opts);


   // Get records from a city
   exports.getPool = function() {
     return pool;
   }
