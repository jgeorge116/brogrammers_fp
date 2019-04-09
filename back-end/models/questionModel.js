const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var QuestionModelSchema = new Schema(
  {
    id: String,
    username: String,
    title: {type: String, text: true},
    body: {type: String, text: true},
    tags:  { type: [String], default: [] },
    media: { type: [String], default: [] },
    accepted_answer_id: { type: String, default: null },
    timestamp: Number
  }, {autoIndex: false}
);
QuestionModelSchema.set("collection", "questions");
QuestionModelSchema.index({title:'text',body:'text'});
await QuestionModelSchema.createIndexes();
module.exports = mongoose.model("QuestionModel", QuestionModelSchema);
