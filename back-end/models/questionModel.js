const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const Schema = mongoose.Schema;

var QuestionModelSchema = new Schema(
  {
    id: String,
    username: String,
    title: { type: String, es_indexed: true },
    body: { type: String, es_indexed: true },
    score: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    media: { type: [String], default: [] },
    accepted_answer_id: { type: String, default: null },
    timestamp: Number
  },
  { autoIndex: false }
);
QuestionModelSchema.set("collection", "questions");
// QuestionModelSchema.index({title:'text',body:'text'});
QuestionModelSchema.plugin(mongoosastic, {
  host: "192.168.122.49:9200"
});

module.exports = mongoose.model("QuestionModel", QuestionModelSchema);
