const AnswerRepository = require("../repositories/answerRepository");
const AR = new AnswerRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();

exports.add_answer = async function(req, res) {
  if (!req.headers.authorization && !req.cookies.access_token) {
    res.status(400).send({ status: "error", error: "No token provided" });
  } else {
    if (!req.headers.authorization) {
      var jwt = await JWT.validate(req.cookies.access_token);
    } else {
      var jwt = await JWT.validate(req.headers.authorization);
    }
    if (!jwt.username) {
      //   res.clearCookie("access_token", { httpOnly: true });
      res.clearCookie("access_token");
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
  var result = await AR.get_question_answers(req.params.id);

  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, answers: result.data });
  }
};

exports.get_user_answers = async (req, res) => {
  let result = await AR.get_user_answers(req.params.id);

  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, answers: result.data });
  }
};

exports.upvote_answer = async (req, res) => {
  if (!req.headers.authorization && !req.cookies.access_token) {
    res.status(400).send({ status: "error", error: "No token provided" });
  } else {
    if (!req.headers.authorization) {
      var token = await JWT.validate(req.cookies.access_token);
    } else {
      var token = await JWT.validate(req.headers.authorization);
    }
    if (!token.username) {
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      const result = await AR.upvote_answer(
        req.params.id,
        req.body.upvote,
        token.username
      );
      res.send({ status: result.status });
    }
  }
};

exports.accept_answer = async (req, res) => {
  if (!req.headers.authorization && !req.cookies.access_token) {
    res.status(400).send({ status: "error", error: "No token provided" });
  } else {
    if (!req.headers.authorization) {
      var token = await JWT.validate(req.cookies.access_token);
    } else {
      var token = await JWT.validate(req.headers.authorization);
    }
    if (!token.username) {
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      const result = await AR.accept_answer(req.params.id, token.username);
      res.send({ status: result.status });
    }
  }
};

// NOT AN API ENDPOINT, JUST FOR FRONTEND PRETTINESS
exports.get_answer_upvote_status = async (req, res) => {
    if (!req.headers.authorization && !req.cookies.access_token) {
      res.status(400).send({ status: "error", error: "No token provided" });
    } else {
      if (!req.headers.authorization) {
        var token = await JWT.validate(req.cookies.access_token);
      } else {
        var token = await JWT.validate(req.headers.authorization);
      }
      if (!token.username) {
        res.status(400).send({ status: "error", error: "Invalid JWT" });
      } else {
        const result = await AR.get_answer_upvote_status(
          req.params.id,
          token.username
        );
        res.send({ status: result.status, upvote: result.upvote });
      }
    }
  };