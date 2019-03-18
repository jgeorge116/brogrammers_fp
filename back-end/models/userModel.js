const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserModelSchema = new Schema({
  id: String,
  username: String,
  email: String,
  password: String,
  verificationKey: String,
  isVerified: { type: Boolean, default: false },
  reputation: { type: Number, default: 0 }
});

UserModelSchema.set("collection", "users");
module.exports = mongoose.model("UserModel", UserModelSchema);
