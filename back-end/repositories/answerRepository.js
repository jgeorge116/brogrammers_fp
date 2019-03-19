const Mongoose = require("mongoose");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const uuidv4 = require("uuid/v4");

module.exports = class AnswerRepository {
  async create(question_id, username, body, media) {
    const new_id = uuidv4();
    const new_answer = new AnswerModel({
      id: new_id,
      question_id: question_id,
      username: username,
      body: body,
      tags: media
    });
    await new_answer.save();

    return { status: "OK", data: new_id };
  }

  async get_answers(question_id) {
    // console.log(id);
    var found_answers = await AnswerModel.find({ question_id: question_id });
    if (!found_answers)
      return { status: "error", data: "Question does not exist" };
    var all_answers = [];
    // console.log(found_answers);
    for (var answer in found_answers) {
        // console.log(answer);
      all_answers.push({
        id: found_answers[answer].id,
        user: found_answers[answer].username,
        body: found_answers[answer].body,
        score: 0, //TODO IMPLEMENT THIS
        is_accepted: false, //TODO IMPLEMENT THIS
        timestamp: found_answers[answer].timestamp,
        media: found_answers[answer].media
      });
    }
    return { status: "OK", data: all_answers };
  }
};
