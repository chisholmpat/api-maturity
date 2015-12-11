module.exports = {
  getConnection: function () {
	var mysql   = require('mysql');
    	var connection = mysql.createConnection({
	host     : 'us-cdbr-iron-east-03.cleardb.net',
	user     : 'bbcabd11525ed5',
	password : '102fb0ce',
	database : 'ad_a9e53e0371a808b'
	});
	console.log("Returning connection");
	return connection;
  },

};

