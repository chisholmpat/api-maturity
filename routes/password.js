module.exports = function(app) {
    var knex = require('../db/db.js').knex;
    var async = require('async');
    var crypto = require('crypto');
    var nodemailer = require('nodemailer');
    var passwordHelper = require('../helpers/password');


    app.post('/forgot', function(req, res, next) {

        async.waterfall([

            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {

                // Replace with a database call.  
                knex.select('').from('users').where('email', req.body.email).asCallback(function(err, rows) {
                    console.log(err);
                    console.log(req.body.email);
                    console.log(rows);
                    if (err || !rows || !rows[0])
                        res.redirect('/reset');
                    else {

                        user = rows[0]; // extract the user
                        user.reset_password_token = token;
                        user.reset_password_expires = Date.now() + 3600000; // 1 hour
                    }

                    knex('users')
                        .where('id', user.id)
                        .update({
                            reset_password_token: token,
                            reset_password_expires: Date.now() + 3600000 // 1 hour     
                        }).asCallback(function(err, rows) {
                            console.log(err);
                            console.log(rows);
                            done(err, token, user)
                        });

                });
            },
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
                    from: 'passwordreset@demo.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    console.log('Email Sent to ' + user.email);
                    console.log(err);
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });


    app.get('/checkToken/:token', function(req, res) {

        var token = req.params.token;
        console.log(req.params.token);

        knex.select('').from('users').where('reset_password_token', token)
            .where('reset_password_expires', '>', Date.now()).asCallback(function(err, rows) {
                if (rows && rows[0])
                    res.send(rows[0].email);
                else
                    res.send(400);
            })
    });

    app.post('/updatepassword', function(req, res) {

        var token = req.body.token;
        var password = req.body.password;
        var salt = Math.random().toString(36).slice(2);
        
        passwordHelper.hash(password, user.salt, function(err, result) {
            password = result;

            knex.update('users').where('reset_password_token', token).update({
                reset_password_token : 0,
                salt: salt,
                password: password
            }).asCallback(function(err, res){
                    if(!err)
                        res.send(200);
                    else
                        res.send(400);
            });
    });


    /*
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }
                res.render('reset', {
                    user: req.user
                });
            });
        });
    */

}
