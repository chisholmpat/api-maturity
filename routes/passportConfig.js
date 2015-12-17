// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
// Dependencies
var mysql = require('mysql');
var queries = require('../querying/usersQuerying');
module.exports = function (passport){

    var LocalStrategy   = require('passport-local').Strategy;

    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
      },
      function(req, username, password, cb) {

        var queryReturn;
        var results_array;
        var user = {};

        console.log("Reached the stratergy");
        // console.log("Done with querying");
        queryReturn = queries.userLoginValidate(username, password, req, function (res, err_string, results_array) {
            if (!err_string) {
                if(results_array.length != 0){
                  user.name = username;
                  user.password = password;
                  console.log("Valid User");
                  return cb(null, user);
                }
                else{
                  console.log("user-invalid");
                  return cb(null, false);
                }
            }
            else {
                console.log(err_string);
                return cb(null, false);
            }
        });
      }
    ));

    passport.serializeUser(function(user, cb) {
      console.log("SerializingUser" + user.name);
      cb(null, user);
    });

    passport.deserializeUser(function(id, cb) {
      console.log("DeSerializingUser   " + id);
      cb(null, id);
    });
};
