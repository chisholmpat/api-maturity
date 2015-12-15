module.exports = function (app, passport) {


  var LocalStrategy   = require('passport-local').Strategy;

  passport.use('local-login', new LocalStrategy(
    function(username, password, cb) {
      return cb(null, false);
    }
  ));

  app.post('/userLogin',
    passport.authenticate('local-login', { session: false, failureRedirect: '/#/userLogin', successRedirect: '/'  } )
  );

};
