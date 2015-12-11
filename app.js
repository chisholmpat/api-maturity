var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');
var sqlite = require('sqlite3').verbose();
var mySQL = require('mysql');
var db = require('./db/db.js');

db.getConnection();

// route file includes
var routes = require('./routes/index');
var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var index = require('./routes/index')(app);
var questions = require('./routes/questions')(app);
var addAnswers = require('./routes/addAnswers')(app);

//Statically serve up necessary files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// hosting config
var appEnv = cfenv.getAppEnv();
var port = appEnv.port || '3000';
// start server on the specified port and binding host
app.listen(appEnv.port , function() {
    console.log("server starting on " + appEnv.url);
});


     //if (process.env.VCAP_SERVICES) {
       //var services = JSON.parse(process.env.VCAP_SERVICES);
       
       //for (var svcName in services) {
     //    if (svcName.match(/^mysql/)) {
         //if (svcName.match(/^cleardb/)) {
	 //var mysqlCreds = services[svcName][0]['credentials'];
         //db = mysql.createPool({
         //host: mysqlCreds.host,
	 //	     host: mysqlCreds.hostname || 'us-cdbr-iron-east-03.cleardb.net',  // not host
	 //	     port: mysqlCreds.port || 3306,
	 //	     user: mysqlCreds.username ||  'bbcabd11525ed5'// not user
	 //	     password: mysqlCreds.password || '102fb0ce'
	 //	     database: mysqlCreds.name || 'ad_a9e53e0371a808b',
         //        });
	 //  }
module.exports = app;



