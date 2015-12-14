var db = require("../db/db.js");

exports.getAllQuestions = function (client_id, form_id, res, callback) {

    var sql = "SELECT ClientQuestionResponse.client_id, Form.name as form_name, Question.id, Question.text, Question.category_id, ClientQuestionResponse.response_id, ClientQuestionResponse.weight\
    FROM ClientQuestionResponse \
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id\
    INNER JOIN Form On Question.form_id = Form.id\
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";

    db.callQuery(res, callback, sql, [client_id, form_id]);

};

exports.getAllAnswers = function (client_id, form_id, res, callback) {


    var sql = "SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
    ClientQuestionResponse.weight, Question.category_id, Question.group_id, Grouping.name\
    FROM ClientQuestionResponse\
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
    INNER JOIN Grouping ON Question.group_id=Grouping.id \
    LEFT  JOIN Response ON ClientQuestionResponse.response_id=Response.id \
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";

    db.callQuery(res, callback, sql, [client_id, form_id]);
};

exports.getAllResponses = function (res, callback) {

    var sql = "SELECT * FROM RESPONSE";
    db.callQuery(res,callback, sql);
};

exports.getAllFormsByClient = function (client_id, res, callback) {

    var sql = "SELECT DISTINCT Form.id, Form.name FROM Form\
    INNER JOIN Question on Form.id=Question.form_id\
    INNER JOIN ClientQuestionResponse on Question.id = ClientQuestionResponse.question_id\
    WHERE  ClientQuestionResponse.client_id = ?"

    db.callQuery(res,callback, sql, [client_id]);
};


exports.getAllForms = function (res, callback) {

    var sql = "SELECT DISTINCT Form.id, Form.name, ClientQuestionResponse.client_id FROM Form\
    INNER JOIN Question on Form.id=Question.form_id\
    INNER JOIN ClientQuestionResponse on Question.id = ClientQuestionResponse.question_id"

    db.callQuery(res,callback, sql);
};


exports.getClients = function (res, callback) {
    var sql = "SELECT Client.id, Client.name from Client";
    db.callQuery(res,callback, sql);
};
