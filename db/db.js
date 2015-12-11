 
module.exports = {
  
  getConnection: function () {
  
  var mysql   = require('mysql');
  var connection = null;
  
  if(!connection) {
  
  if (process.env.VCAP_SERVICES) {
		var services = JSON.parse(process.env.VCAP_SERVICES);
		
		for (var svcName in services) {
			if (svcName.match(/^cleardb/)) {
				var mysqlCreds = services[svcName][0]['credentials'];
				  connection = mysql.createConnection({
				  host: mysqlCreds.host,
				  host: mysqlCreds.hostname, 
				  port: mysqlCreds.port,
				  user: mysqlCreds.username, 
				  password: mysqlCreds.password,
				  database: mysqlCreds.name
				});
		}}
		
	} else {
  
		connection = mysql.createConnection({
		host     : 'us-cdbr-iron-east-03.cleardb.net',
		user     : 'bbcabd11525ed5',
		password : '102fb0ce',
		database : 'ad_a9e53e0371a808b'
	});
  }
}

	return connection;
  }};
  