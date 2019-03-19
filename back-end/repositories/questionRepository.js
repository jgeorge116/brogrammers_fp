const Mongoose = require("mongoose");
const QuestionModel = require("../models/questionModel");
const AnswerModel = require("../models/answerModel");
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
    var question = await this.question_to_api_format(found_question);
    return { status: question.status, data: question.data };
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

  async search_questions(timestamp, limit, accepted) {
    var search_timestamp = timestamp;
    if (!search_timestamp) search_timestamp = new Date().getTime();
    var search_limit = limit;
    if (!search_limit) search_limit = 25;
    if (search_limit > 100) search_limit = 100;
    var search_accepted = accepted;
    if (!search_accepted) search_accepted = false;
    var search_results;
    if (search_accepted) {
      search_results = await QuestionModel.find({
        timestamp: { $lte: search_timestamp },
        accepted_answer_id: { $ne: null }
      });
    } else {
      var search_results = await QuestionModel.find({
        timestamp: { $lte: search_timestamp },
        accepted_answer_id: null
      })
        .limit(search_limit)
        .sort({
          timestamp: -1
        });
    }
    var all_questions = [];
    for (var result in search_results) {
      var question_info = await this.question_to_api_format(
        search_results[result]
      );
      if (question_info.status == "error")
        return { status: "error", data: "Error fetching question data" };
      all_questions.push(question_info.data);
    }
    return { status: "OK", data: all_questions };
  }

  async question_to_api_format(format_question) {
    const user = await UserModel.findOne({
      username: format_question.username
    });
    if (!user)
      return {
        status: "error",
        data: "User who created question does not exist"
      };
    const view_count = await ViewQuestionModel.countDocuments({
      question_id: format_question.id
    });
    const answer_count = await AnswerModel.countDocuments({
      question_id: format_question.id
    });
    var question = {
      id: format_question.id,
      user: {
        id: user.id,
        username: user.username,
        reputation: user.reputation
      },
      title: format_question.title,
      body: format_question.body,
      score: 0, // TODO: IMPLEMENT THIS
      view_count: view_count,
      answer_count: answer_count,
      timestamp: format_question.timestamp,
      media: format_question.media,
      tags: format_question.tags,
      accepted_answer_id: format_question.accepted_answer_id
    };
    return { status: "OK", data: question };
  }
};
