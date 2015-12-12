var db = require("../db/db.js");
var pool = db.getPool();

exports.addAnswers = function (res, callback, sql) {
    db.callQuery(res, callback, sql);
};
