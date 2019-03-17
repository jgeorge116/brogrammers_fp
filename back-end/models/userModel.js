var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserModelSchema = new Schema({
    username: String,
    email: String,
    password: String,
    verification_key: String,
    isVerified: Boolean
});

UserModelSchema.set('collection', 'users');
module.exports = mongoose.model("UserModel", UserModelSchema);
