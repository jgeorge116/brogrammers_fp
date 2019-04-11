const QuestionRepository = require("../repositories/questionRepository");
const QR = new QuestionRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();

exports.add_question = async function(req, res) {
  if (!req.cookies.jwt) {
    res.send({ status: "error", error: "No token provided" });
  } else {
    var jwt = await JWT.validate(req.cookies.jwt);
    if (!jwt.username) {
      res.clearCookie("jwt", { httpOnly: true });
      res.send({ status: "error", error: "Invalid JWT" });
    } else {
      const username = jwt.username;
      var result = await QR.create(
        username,
        req.body.title,
        req.body.body,
        req.body.tags
      );
      if (result.status == "error") {
        res.send({ status: result.status, error: result.data });
      } else {
        res.send({ status: result.status, id: result.data });
      }
    }
  }
};

exports.get_question_by_id = async function(req, res) {
  var ip = req.ip;
  if (!req.cookies.jwt) {
    // No JWT, use IP instead
    await QR.add_view_to_question(req.params.id, {
      type: "IP",
      query: ip
    });
  } else {
    var jwt = await JWT.validate(req.cookies.jwt);
    if (!jwt.username) {
      // JWT is modified or expired, use IP instead
      res.clearCookie("jwt", { httpOnly: true });
      await QR.add_view_to_question(req.params.id, {
        type: "IP",
        query: ip
      });
    } else {
      // JWT is valid
      await QR.add_view_to_question(req.params.id, {
        type: "username",
        query: jwt.username
      });
    }
  }
  var result = await QR.get_questions_by_id(req.params.id);
  if (result.status == "error") {
    res.send({ status: result.status, error: result.data });
  } else {
    res.send({ status: "OK", question: result.data });
  }
};

exports.search_questions = async function(req, res) {
  var result = await QR.search_questions(
    req.body.timestamp,
    req.body.limit,
    req.body.accepted,
    req.body.q
  );
  if (result.status == "error") {
    res.send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, questions: result.data });
  }
};

exports.delete_question_by_id = async function(req, res) {
  if (!req.cookies.jwt) {
    // User needs to be logged in
    res.status(500).send({ status: "error", error: "No token provided" });
  } else {
    // Only delete if user is original asker
    const token = await JWT.validate(req.cookies.jwt);
    console.log(token);
    if (!token.username) {
      res.status(500).send({ status: "error", error: "Invalid JWT" });
    } else {
      var result = await QR.delete_question(req.params.id, token.username);
      if (result.status == 'OK') {
        res.status(200).send({ status: result.status, data: result.data });
      } else {
        res.status(500).send({ status: result.status, data: result.data });
      }
    }
  }
}

exports.get_user_questions = async (req, res) => {
  let result = await QR.get_questions_by_userID(req.params.id)
  res.send({status: result.status, questions: result.data})
}

exports.upvote_question = async (req, res) => {
  if (!req.cookies.jwt) {
    res.send({ status: "error", error: "No token provided" });
  } else {
    const token = await JWT.validate(req.cookies.jwt);
    if (!token.username) {
      res.send({ status: "error", error: "Invalid JWT" });
    } else {
      const result = await QR.upvote_question(req.params.id, req.body.upvote, token.username);
    }
  }
}