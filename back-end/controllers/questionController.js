const QuestionRepository = require("../repositories/questionRepository");
const QR = new QuestionRepository();

exports.add_question = async function(req, res) {
  var result = await QR.create(
    req.body.username,
    req.body.title,
    req.body.body,
    req.body.tags
  );
  if (result.status == "error") {
    res.send({ status: result.status, error: result.data });
  } else res.send({ status: result.status, id: result.data });
};

exports.get_question_by_id = async function(req, res) {
  // console.log(req.params.id);
  var result = await QR.get_questions_by_id(req.params.id);
  if (result.status == "error")
    res.send({ status: result.status, error: result.data });
  else res.send({ status: "OK", question: result.data });
};
