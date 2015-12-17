
// var connectEnsure = require('connect-ensure-login');



module.exports = function (app, passport) {
  var passportConfig = require('./passportConfig.js')(passport);
  app.post('/userLogin',passport.authenticate('local-login', {session: true, failureRedirect: '/#/userLogin' }),
    function(req, res) {
      console.log("In  isAuthenticated request is: " + req.isAuthenticated());
      res.redirect('/');
  });

  app.get('/login', function(req, res) {
      res.redirect('/tryingToLogin');
  });

  app.get('/testLogin',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.redirect('/testLoginSuccess');
  });

};
