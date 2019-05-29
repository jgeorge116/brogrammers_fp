const mongoose = require("mongoose");
//const mongoosastic = require("mongoosastic");
const Schema = mongoose.Schema;
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://192.168.122.49:9200' });

var QuestionModelSchema = new Schema(
  {
    id: { type: String },
    username: String,
    title: { type: String },
    body: { type: String },
    score: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    media: { type: [String], default: [] },
    accepted_answer_id: { type: String, default: null },
    timestamp: {type: Number, es_type: 'double'},
    answer_count: { type: Number, default: 0 },
    view_count: { type: Number, default: 0 }
  },
  { autoIndex: false }
);
QuestionModelSchema.set("collection", "questions");
// QuestionModelSchema.index({title:'text',body:'text'});
//QuestionModelSchema.plugin(mongoosastic, {
//  host: "192.168.122.49",
//  port: 9200
//});
QuestionModelSchema.index({ id: 1 });

var questionModel = mongoose.model("QuestionModel", QuestionModelSchema);
module.exports = questionModel;

