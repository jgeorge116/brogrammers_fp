const UserRepository = require("../repositories/userRepository");
const UR = new UserRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();

exports.add_user = async function(req, res) {
  var result = await UR.create(
    req.body.username,
    req.body.password,
    req.body.email
  );
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status });
  }
};

exports.verify = async function(req, res) {
  var result = await UR.verify(req.body.email, req.body.key);
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status });
    console.log(`Successfully verified ${req.body.email}`);
  }
};

exports.login = async function(req, res) {
  var result = await UR.login(req.body.username, req.body.password);
  if (result.status !== "error") {
    const token = await JWT.generate(req.body.username);
    res.cookie("access_token", token);
    // res.cookie('access_token', token, { httpOnly: true });
  }
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
    console.log(`User ${req.body.username} failed login due to: ${result.data}`);
  } else {
    res.send({ status: result.status });
  }
};

exports.logout = async function(req, res) {
  //   res.clearCookie('access_token', { httpOnly: true });
  res.clearCookie("access_token");
  res.send({ status: "OK" });
};

exports.resend_verification = async function(req, res) {
  var result = await UR.resend_verification(req.body.username);

  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status });
  }
};

exports.getUserInfo = async (req, res) => {
  let result = await UR.getUserInfo(req.params.id);
  if (result.status == "error") {
    console.log(`Getting user failed because of ${result.data}`);
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: result.status, user: result.data });
  }
};
