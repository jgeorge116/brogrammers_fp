const UserRepository = require("../repositories/userRepository");
const UR = new UserRepository();
const Authentication = require('../utils/authentication');
const JWT = new Authentication(UR);

exports.add_user = async function(req, res) {
  var result = await UR.create(
    req.body.username,
    req.body.password,
    req.body.email
  );
//   console.log(result);
  res.send({ status: result.status, error: result.data });
};

exports.verify = async function(req, res) {
  var result = await UR.verify(req.body.email, req.body.key);
  res.send({ status: result.status, error: result.data });
};

exports.login = async function(req, res) {
  var result = await UR.login(req.body.username, req.body.password);
  if (result.status !== 'error') {
    const token = JWT.generate(req.body.username, req.body.password);
    res.cookie('jwt', token, { httpOnly: true });
  }
  res.send({ status: result.status, error: result.data });
};

exports.logout = async function(req, res) {
  console.log("SUP, logout not done");
  res.clearCookie('jwt', { httpOnly: true });
};

exports.resend_verification = async function(req, res) {
  var result = await UR.resend_verification(req.body.username);
  res.send({ status: result.status, error: result.data });
};
