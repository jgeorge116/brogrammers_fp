const AnswerRepository = require("../repositories/answerRepository");
const AR = new AnswerRepository();

exports.add_answer = async function(req, res) {
  var result = await AR.create(req.params.id, req.body.username, req.body.body, req.body.media);
  if (result.status == "error") {
    res.send({ status: result.status, error: result.data });
  } else res.send({ status: result.status, id: result.data });
};

exports.get_answers = async function(req, res) {
  var result = await AR.get_answers(req.params.id);

  res.send({ status: result.status, error: result.data });
};
