const AnswerRepository = require("../repositories/answerRepository");
const AR = new AnswerRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();

exports.add_answer = async function(req, res) {
  if (!req.cookies.jwt) {
    res.status(400).send({ status: "error", error: "No token provided" });
  } else {
    var jwt = await JWT.validate(req.cookies.jwt);
    if (!jwt.username) {
      res.clearCookie("jwt", { httpOnly: true });
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      var result = await AR.create(
        req.params.id,
        jwt.username,
        req.body.body,
        req.body.media
      );
      if (result.status == "error") {
        res.status(400).send({ status: result.status, error: result.data });
      } else res.send({ status: result.status, id: result.data });
    }
  }
};

exports.get_question_answers = async function(req, res) {
  var result = await AR.get_answers(req.params.id);
  
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, answers: result.data });
  }
};

exports.get_user_answers = async (req,res) => {
  let result = await AR.getUserAnswers(req.params.id);
  
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, answers: result.data });
  }
};

exports.upvote_answer = async (req, res) => {
  if (!req.cookies.jwt) {
    res.status(400).send({ status: "error", error: "No token provided" });
  } else {
    const token = await JWT.validate(req.cookies.jwt);
    if (!token.username) {
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      const result = await AR.upvote_answer(req.params.id, req.body.upvote, token.username);
      res.send({ status: result.status });
    }
  }
};

exports.accept_answer = async (req, res) => {
  if (!req.cookies.jwt) {
    res.status(400).send({ status: "error", error: "No token provided" }); 
  } else {
    const token = await JWT.validate(req.cookies.jwt);
    if (!token.username) {
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      const result = await AR.accept_answer(req.params.id, token.username);
      res.send({ status: result.status });
    }
  }
};
