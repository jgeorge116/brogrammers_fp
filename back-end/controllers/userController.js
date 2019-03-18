const UserRepository = require("../repositories/userRepository");
const UR = new UserRepository();

exports.add_user = async function(req, res) {
  var result = await UR.create(
    req.body.username,
    req.body.password,
    req.body.email
  );
  console.log(result);
  res.send({ status: result.status, error: result.data });
};

exports.verify = async function(req, res) {
  var result = await UR.verify(req.body.email, req.body.key);
  res.send({ status: result.status, error: result.data });
};

exports.login = async function(req, res) {
  var result = await UR.login(req.body.username, req.body.password);
  res.send({ status: result.status, error: result.data });
};

exports.logout = async function(req, res) {
  console.log("SUP, logout not done");
};

exports.resend_verification = async function(req, res) {
  var result = await UR.resend_verification(req.body.username);
  res.send({ status: result.status, error: result.data });
};
