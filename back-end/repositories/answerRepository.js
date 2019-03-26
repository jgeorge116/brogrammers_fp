const Mongoose = require("mongoose");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const QuestionModel = require("../models/questionModel")
const uuidv4 = require("uuid/v4");

module.exports = class AnswerRepository {
  /**
   * Creates an answer authored by the username to a specific
   * question. Includes media.
   * @param {String} question_id
   * @param {String} username
   * @param {String} body
   * @param {Array of Strings} media
   */
  async create(question_id, username, body, media) {
    if (!username) {
      return { status: "error", data: "Username is required" };
    }
    if (!body) {
      return { status: "error", data: "Body is required" };
    }
    var found_question = await QuestionModel.findOne({ id: question_id });
    if (!found_question) {
      return { status: "error", data: "Question does not exist" };
    }
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
  
  /**
   * Gets all the answers associated with a question.
   * @param {String} question_id 
   */
  async get_answers(question_id) {
    var found_question = await QuestionModel.findOne({ id: question_id });
    if (!found_question) {
      return { status: "error", data: "Question does not exist" };
    }
    var found_answers = await AnswerModel.find({ question_id: question_id });
    if (!found_answers)
      return { status: "error", data: "Question does not exist" };
    var all_answers = [];
    for (var answer in found_answers) {
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

  /**
   * Gets all the answer ids from a certain user.
   * @param {String} username 
   */
  async getUserAnswers(username) {
    let found_answers = await AnswerModel.find({username: username})
    if(found_answers.length == 0) return {status: "error", data: "User has not posted answers yet!"}
    let all_answers = []
    found_answers.forEach(ans => all_answers.push(ans.id))
    return {status: "OK", data: all_answers}
  }
};
