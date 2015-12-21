module.exports = function (app) {
    // var passport = require(passport);
    // var passportConfig = require('./passportConfig.js')(passport);

    app.get('/', function (req, res, next) {
        res.sendFile('__dirname' + '/public/index.html');
    });

};
