module.exports = function(app) {

    // Dependencies
    var knex = require('../db/db.js').knex;
    var async = require('async');
    var crypto = require('crypto');
    var nodemailer = require('nodemailer');
    var passwordHelper = require('../helpers/password');

    // End-point for triggering the calls which end in sending the user 
    // an email with their reset token.
    app.post('/forgot', function(req, res, next) {

        async.waterfall([
            function(done) {
                // Generate a token for the user.
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {

                knex.select('').from('users')
                    .where('email', req.body.email)
                    .asCallback(function(err, rows) {
                        if (err || !rows || !rows[0])
                            res.send(400, 'User not found');
                        else {
                            // set the token on the user and 
                            // set an expiration time for the token
                            user = rows[0]; // extract the user
                            user.reset_password_token = token;
                            user.reset_password_expires = Date.now() + 3600000; // 1 hour
                        
                        // persist the token into the database
                        knex('users')
                            .where('id', user.id)
                            .update({
                                reset_password_token: token,
                                reset_password_expires: Date.now() + 3600000 // 1 hour     
                            }).asCallback(function(err, rows) {
                                done(err, token, user);
                            });
						}
                    });
            },
            // Send the email containing the link
            function(token, user, done) {
                var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'SendGrid',
                    auth: {
                        user: 'a7OagSo4Gi',
                        pass: 'sgpwsgpw10!'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'hatt@ca.ibm.com',
                    subject: 'API Maturity Tool Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) return next(err);
			res.send(200);
        });
    });


    // Route for checking the validity of a token and retrieving
    // the email of the requester to use for password reset.
    app.get('/checkToken/:token', function(req, res) {
        var token = req.params.token;
        knex.select('').from('users').where('reset_password_token', token)
            .where('reset_password_expires', '>', Date.now()).asCallback(function(err, rows) {
                if (rows && rows[0])
                    res.send(rows[0].email);
                else
                    res.send(400);
            });
    });

    // Route for updating user's password
    app.post('/updatepassword', function(req, res) {
        var token = req.body.token;
        var password = req.body.password;
        var salt = Math.random().toString(36).slice(2);

        passwordHelper.hash(password, salt, function(err, result) {
            password = result;
            knex('users').where('reset_password_token', token).update({
                reset_password_expires: 0,
                salt: salt,
                password: password
            }).asCallback(function(err, rows) {
                if (!err)
                    res.send(200, "Password Changed");
                else
                    res.send(400);
            });
        });

    });

};
