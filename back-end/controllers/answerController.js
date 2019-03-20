const AnswerRepository = require("../repositories/answerRepository");
const AR = new AnswerRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();

exports.add_answer = async function(req, res) {
  if (!req.cookies.jwt) {
    res.send({ status: "error", error: "No token provided" });
  } else {
    var jwt = await JWT.validate(req.cookies.jwt);
    if (!jwt.username) {
      res.clearCookie("jwt", { httpOnly: true });
      res.send({ status: "error", error: "Invalid JWT" });
    } else {
      var result = await AR.create(
        req.params.id,
        jwt.username,
        req.body.body,
        req.body.media
      );
      if (result.status == "error") {
        res.send({ status: result.status, error: result.data });
      } else res.send({ status: result.status, id: result.data });
    }
  }
};

exports.get_answers = async function(req, res) {
  var result = await AR.get_answers(req.params.id);
  res.send({ status: result.status, answers: result.data });
};
