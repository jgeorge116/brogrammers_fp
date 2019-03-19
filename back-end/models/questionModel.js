const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var QuestionModelSchema = new Schema(
  {
    id: String,
    username: String,
    title: String,
    body: String,
    tags:  { type: [String], default: [] },
    media: { type: [String], default: [] },
    accepted_answer_id: { type: String, default: null },
    timestamp: {type: Number, default: new Date().getTime()}
  }
);
QuestionModelSchema.set("collection", "questions");
module.exports = mongoose.model("QuestionModel", QuestionModelSchema);
