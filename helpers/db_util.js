// Function to check whether use is authenticated
module.exports.checkAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

// callback for queries with a result return
module.exports.callback = function callback(err, res, results) {
    if (!err) {
        console.log(results);
        res.send(results);
    } else {
        console.log(err);
        res.send('400', err);
    }
};

// callback for queries with no expected return
module.exports.callbackNoReturn = function callbackNoResults(err, res) {
    if (!err) {
        res.send('200');
    } else {
        res.send('400', err);
    }
};
