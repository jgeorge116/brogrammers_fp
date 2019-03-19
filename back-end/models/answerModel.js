const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AnswerModelSchema = new Schema({
  id: String,
  question_id: String,
  username: String,
  body: String,
  is_accepted: { type: Boolean, default: false},
  timestamp: { type: Number, default: new Date().getTime() },
  media: [Number]
});

AnswerModelSchema.set("collection", "answers");
module.exports = mongoose.model("AnswerModel", AnswerModelSchema);
