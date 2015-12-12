var db = require("../db/db.js");

exports.getAllQuestions = function (client_id, form_id, res, callback) {

    var sql = "SELECT ClientQuestionResponse.client_id, Question.id, Question.text, Question.category_id, ClientQuestionResponse.response_id, ClientQuestionResponse.weight\
    FROM ClientQuestionResponse INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id\
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";

    var params = [client_id, form_id];

    db.callQuery(res, callback, sql, params);

};

exports.getAllAnswers = function (client_id, form_id, res, callback) {

    var sql = "SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
    ClientQuestionResponse.weight, Question.category_id, Grouping.name\
    FROM ClientQuestionResponse\
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
    INNER JOIN Grouping ON Question.group_id=Grouping.id \
    LEFT  JOIN Response ON ClientQuestionResponse.response_id=Response.id \
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";

    var params = [client_id, form_id];
    db.callQuery(res, callback, sql, params);
};

exports.getAllResponses = function (res, callback) {

    var sql = "SELECT * FROM RESPONSE";
    db.callQuery(res,callback, sql);
};

