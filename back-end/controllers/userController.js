const UserRepository = require("../repositories/userRepository");

exports.add_user = async function(req, res) {
  const UR = new UserRepository();
  var result = await UR.create(
    req.body.username,
    req.body.password,
    req.body.email
  );
  res.send({ status: result.status, error: result.data });
};
