const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ViewQuestionModelSchema = new Schema({
  question_id: String,
  username: {type: String, default: null},
  ip: {type: String, default: null}
});

ViewQuestionModelSchema.set("collection", "views");
ViewQuestionModelSchema.index({ question_id: 1 });
module.exports = mongoose.model("ViewQuestionModel", ViewQuestionModelSchema);
