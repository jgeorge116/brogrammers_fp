const Mongoose = require("mongoose");
const QuestionModel = require("../models/questionModel");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const ViewQuestionModel = require("../models/viewQuestionModel");
const uuidv4 = require("uuid/v4");

module.exports = class QuestionRepository {

  /**
   * Creates a question associated with a username
   * @param {String} username 
   * @param {String} title 
   * @param {String} body 
   * @param {Array} tags 
   */
  async create(username, title, body, tags) {
    // Check the fields
    if (!username) {
      return {
        status: "error",
        data: "Username is required"
      };
    }
    if (!title) {
      return {
        status: "error",
        data: "Title is required"
      };
    }
    if (!body) {
      return {
        status: "error",
        data: "Body is required"
      };
    }
    if (!tags) {
      return {
        status: "error",
        data: "Tags are required"
      };
    }
    const new_id = uuidv4();
    const new_question = new QuestionModel({
      id: new_id,
      username: username,
      title: title,
      body: body,
      tags: tags,
      timestamp: Date.now() / 1000
    });
    await new_question.save();
    return {
      status: "OK",
      data: new_id
    };
  }

  /**
   * Get a question associated with an id
   * @param {String} id 
   */
  async get_questions_by_id(id) {
    var found_question = await QuestionModel.findOne({
      id: id
    });
    if (!found_question) {
      return {
        status: "error",
        data: "Question does not exist"
      };
    }
    var question = await this.question_to_api_format(found_question);
    return {
      status: question.status,
      data: question.data
    };
  }

  /**
   * Add a view to a question by IP or username
   * @param {String} id 
   * @param {String} info 
   */
  async add_view_to_question(id, info) {
    var found_question = await QuestionModel.findOne({
      id: id
    });
    if (!found_question) {
      // Don't add a view if question does not exist
      return;
    }
    if (info.type == "IP") {
      // Don't increment if there is a view with this IP
      const find_view = await ViewQuestionModel.findOne({
        ip: info.query
      });
      if (find_view) {
        return;
      }
      const new_view = new ViewQuestionModel({
        question_id: id,
        ip: info.query
      });
      new_view.save();
    } else {
      // Don't increment if there is a view with this username
      const find_view = await ViewQuestionModel.findOne({
        username: info.query
      });
      if (find_view) {
        return;
      }
      const new_view = new ViewQuestionModel({
        question_id: id,
        username: info.query
      });
      new_view.save();
    }
  }

  /**
   * Searches for questions based on timestamp, limit, accepted (only questions with accepted answers)
   * @param {Integer} timestamp - Optional
   * @param {Integer} limit - Optional
   * @param {boolean} accepted - Optional
   */
  async search_questions(timestamp, limit, accepted) {
    var search_timestamp = timestamp;
    if (!search_timestamp) {
      search_timestamp = new Date().getTime();
    }
    if (search_timestamp < 0) {
      return {
        status: "error",
        data: "Timestamp has to be a non-negative integer"
      };
    }
    // Search limit defaults to 25, and maxes out at 100
    var search_limit = limit;
    if (!search_limit) {
      search_limit = 25;
    }
    if (!Number.isInteger(search_limit) || search_limit < 1) {
      return {
        status: "error",
        data: "Limit has to be a positive integer"
      };
    }
    if (search_limit > 100) {
      search_limit = 100;
    }
    var search_accepted = accepted;
    if (!search_accepted) {
      search_accepted = false;
    }
    if (typeof search_accepted !== 'boolean') {
      return {
        status: "error",
        data: "Accepted has to be a boolean"
      };
    }
    var search_results;
    if (search_accepted) {
      search_results = await QuestionModel.find({
          timestamp: {
            $lte: search_timestamp
          },
          accepted_answer_id: {
            $ne: null
          }
        })
        .limit(search_limit)
        .sort({
          timestamp: -1
        });
    } else {
      search_results = await QuestionModel.find({
          timestamp: {
            $lte: search_timestamp
          },
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
        return {
          status: "error",
          data: "Error fetching question data"
        };
      all_questions.push(question_info.data);
    }
    return {
      status: "OK",
      data: all_questions
    };
  }

  /**
   * Format a question into the one specified in the doc
   * @param {Object} format_question 
   */
  async question_to_api_format(format_question) {
    const user = await UserModel.findOne({
      username: format_question.username
    });
    if (!user) {
      return {
        status: "error",
        data: "User who created question does not exist"
      };
    }
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
    return {
      status: "OK",
      data: question
    };
  }

  /**
   * Deletes a question by id posted by user with username
   * @param {String} id 
   * @param {String} username 
   */
  async delete_question(id, username) {
    const found_question = await QuestionModel.findOne({ id: id });
    if (!found_question) {
      return { status: 'error', data: 'Question does not exist!'};
    }
    if (found_question.username != username) {
      return { status: 'error', data: 'User must be the original asker!'};
    }
    await QuestionModel.deleteOne({ id: id });
    return { status: 'OK', data: 'Success' };
  }
};