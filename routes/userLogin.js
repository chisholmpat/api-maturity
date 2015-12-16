// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
// Dependencies
var mysql = require('mysql');
var queries = require('../querying/usersQuerying');




module.exports = function (app, passport) {


  var LocalStrategy   = require('passport-local').Strategy;

  passport.use('local-login', new LocalStrategy(
    function(username, password, cb) {

      var queryReturn;
      console.log("Reached the stratergy");
      // console.log("Done with querying");
      queryReturn = queries.userLoginValidate(username, password, "doesn'tmatter", function (res, err_string, results_array) {
          if (!err_string) {
              if(results_array.length != 0){
                console.log("Valid User");
                cb(null, true);
              }
              else{
                console.log("user-invalid");
                cb(null, false);
              }
          }
          else {
              console.log(err_string);
              cb(null, false);
          }
      });
    }
  ));

  app.post('/userLogin',passport.authenticate('local-login', { session:false, failureRedirect: '/#/userLogin', successRedirect: '/' }));

};
