const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ViewQuestionModelSchema = new Schema({
  question_id: String,
  username: {type: String, default: null},
  ip: {type: String, default: null}
});

ViewQuestionModelSchema.set("collection", "views");
module.exports = mongoose.model("ViewQuestionModel", ViewQuestionModelSchema);
