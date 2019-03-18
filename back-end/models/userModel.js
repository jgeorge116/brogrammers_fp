var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserModelSchema = new Schema({
    username: String,
    email: String,
    password: String,
    verificationKey: String,
    isVerified: Boolean
});

UserModelSchema.set('collection', 'users');
module.exports = mongoose.model("UserModel", UserModelSchema);
