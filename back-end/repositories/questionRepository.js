const Mongoose = require("mongoose");
const QuestionModel = require("../models/questionModel");
const UserModel = require("../models/userModel");
const ViewQuestionModel = require("../models/viewQuestionModel");
const uuidv4 = require("uuid/v4");

module.exports = class QuestionRepository {
  async create(username, title, body, tags) {
    const new_id = uuidv4();
    const new_question = new QuestionModel({
      id: new_id,
      username: username,
      title: title,
      body: body,
      tags: tags
    });
    await new_question.save();
    return { status: "OK", data: new_id };
  }

  async get_questions_by_id(id) {
    var found_question = await QuestionModel.findOne({ id: id });
    if (!found_question)
      return { status: "error", data: "Question does not exist" };
    const user = await UserModel.findOne({ username: found_question.username });
    if (!user)
      return {
        status: "error",
        data: "User who created question does not exist"
      };
    const views = await ViewQuestionModel.countDocuments({question_id: id});
    var question = {
      id: found_question.id,
      user: {
        id: user.id,
        username: user.username,
        reputation: user.reputation
      },
      title: found_question.title,
      body: found_question.body,
      score: 0, // TODO: IMPLEMENT THIS
      view_count: views,
      answer_count: 0, // TODO: BE IMPLEMENT THIS
      timestamp: found_question.timestamp,
      media: found_question.media,
      tags: found_question.tags,
      accepted_answer_id: found_question.accepted_answer_id
    };
    return { status: "OK", data: question };
  }

  async add_view_to_question(id, info) {
    if (info.type == "IP") {
      const find_view = await ViewQuestionModel.findOne({ ip: info.query });
      if (find_view) return;
      const new_view = new ViewQuestionModel({
        question_id: id,
        ip: info.query
      });
      new_view.save();
    } else {
      const find_view = await ViewQuestionModel.findOne({
        username: info.query
      });
      if (find_view) return;
      const new_view = new ViewQuestionModel({
        question_id: id,
        username: info.query
      });
      new_view.save();
    }
  }
};
