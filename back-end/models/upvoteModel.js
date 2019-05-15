const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UpvoteModelSchema = new Schema({
  type: String,
  username: String,
  question_id: {type: String, default: null},
  answer_id: {type: String, default: null},
  value: {type: Number, default: 1}
});

UpvoteModelSchema.set("collection", "upvotes");
UpvoteModelSchema.index({ username: 1 });
module.exports = mongoose.model("UpvoteModel", UpvoteModelSchema);
