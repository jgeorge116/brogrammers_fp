const Mongoose = require("mongoose");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const QuestionModel = require("../models/questionModel");
const UpvoteModel = require("../models/upvoteModel");
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
    for (const answer of found_answers) {  
      const upvote_count = await UpvoteModel.countDocuments({
        answer_id: format_question.id,
        value: 1
      });
      const downvote_count = await UpvoteModel.countDocuments({
        answer_id: format_question.id,
        value: -1
      });
      all_answers.push({
        id: answer.id,
        user: answer.username,
        body: answer.body,
        score: upvote_count - downvote_count,
        is_accepted: false, //TODO IMPLEMENT THIS
        timestamp: answer.timestamp,
        media: answer.media
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

  /**
   * Upvotes an answer, or removes upvote, and updates reputation of answerer
   * @param {String} answerID 
   * @param {Boolean} upvote 
   * @param {String} username 
   */
  async upvote_answer(answerID, upvote, username) {
    const found_answer = await AnswerModel.findOne({
      id: answerID
    })
    if (!found_answer) {
      return { status: "error" };
    }
    // Convert the boolean from true/false to 1/-1 (default 1)
    upvote = typeof upvote === 'undefined' ? 1 : upvote ? 1 : -1;
    const found_upvote = await UpvoteModel.findOne({
      type: "answer",
      username: username,
      answer_id: answerID
    });
    const found_user = await UserModel.findOne({
      username: found_answer.username
    });
    if (!found_user) {
      return { status: "error" };
    }
    // Upvoting after already upvoting undoes it
    if (found_upvote && found_upvote.value === upvote) {
      await UpvoteModel.deleteOne(found_upvote);
      return { status: "OK" };
    }
    // Upvoting after downvoting or vice versa, deletes previous upvote
    if (found_upvote) {
      await UpvoteModel.deleteOne(found_upvote); // Might not have to await
    }
    // Create and save upvote
    const new_upvote = new UpvoteModel({
      type: "answer",
      username: username,
      answer_id: answerID,
      value: upvote
    });
    await new_upvote.save();
    // Set reputation of answerer unless it goes below 1
    if (found_user.reputation + upvote >= 1) {
      await UserModel.updateOne(
        { username: found_answer.username }, 
        { $inc: { reputation: upvote } }
      );
    }
    return { status: "OK" };
  }
};
