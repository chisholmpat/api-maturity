// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
// Dependencies
var queries = require('../querying/usersQuerying');
var knex = require("../db/db.js").knex;
var passwordHelper = require('../helpers/password');
// VCAP_SERVICES contains all the credentials of services bound to

// this application. For details of its content, please refer to

// the document or sample of each service.

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

if (process.env.VCAP_SERVICES) {
    var ssoConfig = services.SingleSignOn[0];
    var client_id = ssoConfig.credentials.clientId;
    var client_secret = ssoConfig.credentials.secret;
    var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
    var token_url = ssoConfig.credentials.tokenEndpointUrl;
    var issuer_id = ssoConfig.credentials.issuerIdentifier;
    var callback_url = "https://bmix-essential.mybluemix.net/auth/sso/callback";
}

module.exports = function(passport) {

    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
        function(username, password, done) {

            // Query the DB for the user.
            knex.select('').from('users')
            .where('username', username)
            .asCallback(function(err, rows) {

                    // If the user is found return a result for username.
                    if (rows && rows.length !== 0) {
                        user = rows[0];
                        passwordHelper.verify(password, user.password, user.salt, function(err, res) {
                            if (res) {
                                return done(null, {
                                    name: username,
                                    role: user.role,
                                    email: user.email
                                });
                            } else {
                                return done(null, false, {});
                            }
                        });

                    } else
                        return done(null, false, {
                            message: 'Incorrect username.'
                        });
                });
        }));;

    if (process.env.VCAP_SERVICES) {
        var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
        var Strategy = new OpenIDConnectStrategy({

                authorizationURL: authorization_url,
                tokenURL: token_url,
                clientID: client_id,
                scope: 'openid',
                response_type: 'code',
                clientSecret: client_secret,
                callbackURL: callback_url,
                skipUserProfile: true,
                issuer: issuer_id
            },

            function(accessToken, refreshToken, profile, done) {
                process.nextTick(function() {
                    profile.accessToken = accessToken;
                    profile.refreshToken = refreshToken;
                    profile.name = "Testing";
                    profile.role = "admin";
                    profile.isIBM = '1';
                    profile.email = profile.emailaddress;
                    console.log(profile.emailaddress);
                    done(null, profile);
                })
            }
        );
        passport.use(Strategy);
    }

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

};
