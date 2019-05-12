const Mongoose = require("mongoose");
const QuestionModel = require("../models/questionModel");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const ViewQuestionModel = require("../models/viewQuestionModel");
const UpvoteModel = require("../models/upvoteModel");
const uuidv4 = require("uuid/v4");
const cassandra = require("cassandra-driver");
const client = new cassandra.Client({
  contactPoints: ["192.168.122.50"], //, "192.168.122.49"],
  //   contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  readTimeout: 0
});

module.exports = class QuestionRepository {
  /**
   * Creates a question associated with a username
   * @param {String} username
   * @param {String} title
   * @param {String} body
   * @param {Array} tags
   */
  async create(username, title, body, tags, media) {
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
    var search_question_media = await QuestionModel.find({
      media: { $in: media }
    });
    var search_answer_media = await AnswerModel.find({ media: { $in: media } });
    if (search_question_media.length > 0 || search_answer_media.length > 0) {
      return {
        status: "error",
        data: "Duplicate media"
      };
    }
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    // console.log("author: " + username);
    const new_id = uuidv4();
    if (media) {


      for (let i = 0; i < media.length; i++) {
        var query2 = "SELECT username FROM somedia.media WHERE id = ?;";
        var params2 = [media[i]];
        var results2 = await client.execute(query2, params2, { prepare: true });
        //console.log(results2);
        if (results2.rowLength == 0) {
          console.log(
        '"FAILURE ~~~~~~~~~~~~~~~~~~~~~~~~"' +
          "author: " +
          username +
          "\n" +
          `MEDIA DOES NOT EXIST: ${media[i]}` + "\n" +
          "length of media: " +
          media.length +
          "\n" +
          `all the media: ${media}` +
          "\n" +
          "id : " +
          new_id +
          "\n  ~~~~~~~~~~~~~~~~~~~~~~~~"
      );
          return {
            status: "error",
            data: "Media does not exist"
          }
        }
        if (results2.rows[0].username != username) {
          return {
            status: "error",
            data: "Username does not match or is not theres"
          };
        }
        // console.log(
        //   "media [" +
        //     i +
        //     "]" +
        //     media[i] +
        //     "is ok" +
        //     "\n" +
        //     "owner of the media above: " +
        //     results2.rows[0].username
        // );
      }
    }
    // console.log(
    //   `~~~~~ add question finished with no errors \n with ID of ${new_id}`
    // );

    const new_question = new QuestionModel({
      id: new_id,
      username: username,
      title: title,
      body: body,
      tags: tags,
      media: media,
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
   * @param {Boolean} accepted - Optional
   * @param {String} q - Optional
   * @param {String} sort_by - Optional
   * @param {Array[Strings]} tags - Optional
   * @param {Boolean} has_media - Optional
   */
  async search_questions(
    timestamp,
    limit,
    accepted,
    q,
    sort_by,
    tags,
    has_media
  ) {
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
    var parsed_int = search_limit;
    if (parsed_int < 1) parsed_int = 25;

    if (parsed_int > 100) {
      parsed_int = 100;
    }
    var search_accepted = accepted;
    if (!search_accepted) {
      search_accepted = false;
    }
    if (typeof search_accepted !== "boolean") {
      return {
        status: "error",
        data: "Accepted has to be a boolean"
      };
    }
    var search_q = q;
    console.log(search_q);
    if (!search_q) {
      search_q = "";
    }
    if (typeof search_q !== "string") {
      return {
        status: "error",
        data: "q has to be a string"
      };
    }
    sort_by = sort_by === "timestamp" ? sort_by : "score";
    tags = tags ? tags : null;
    has_media = has_media ? true : false;

    var search_results;
    let query = { timestamp: { $lte: search_timestamp } };
    if (search_q) query.$text = { $search: search_q };
    //   console.log(query);
    if (search_accepted) {
      query.accepted_answer_id = { $ne: null };
    }
    if (tags) {
      query.tags = tags;
    }
    if (has_media) {
      query.media = { $ne: [] };
    }
    if (sort_by === "timestamp") {
      search_results = await QuestionModel.find(query, {
        score: { $meta: "textScore" }
      })
        .limit(parsed_int)
        .sort({ score: { $meta: "textScore" }, timestamp: -1 });
    } else {
      // console.log('QUERY', query);
      // console.log(sort_field);
      search_results = await QuestionModel.find(query, {
        score: { $meta: "textScore" }
      })
        .limit(parsed_int)
        .sort({ score: { $meta: "textScore" } });
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

    const upvote_count = await UpvoteModel.countDocuments({
      question_id: format_question.id,
      type: "question",
      value: 1
    });

    const downvote_count = await UpvoteModel.countDocuments({
      question_id: format_question.id,
      type: "question",
      value: -1
    });

    const score = upvote_count - downvote_count;

    var question = {
      id: format_question.id,
      user: {
        id: user.id,
        username: user.username,
        reputation: user.reputation < 1 ? 1 : user.reputation
      },
      title: format_question.title,
      body: format_question.body,
      score: score,
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
      console.log("Question does not exist");
      return { status: "error", data: "Question does not exist!" };
    }
    if (found_question.username != username) {
      console.log("Author of question: "  + found_question.username + "\n"
      + "Current user: " + username);
      return { status: "error", data: "User must be the original asker!" };
    }
    if (found_question.media) {
      for (let i = 0; i < found_question.media.length; i++) {
        var query = "DELETE FROM somedia.media WHERE id = ? IF EXISTS;";
        var params = [found_question.media[i]];
        await client.execute(query, params);
      }
    }
    AnswerModel.find({ question_id: id })
      .stream()
      .on("data", async function(doc) {
        if (doc.media) {
          for (let i = 0; doc.media.length; i++) {
            var query = "DELETE FROM somedia.media WHERE id = ? IF EXISTS;";
            var params = [doc.media[i]];
            await client.execute(query, params);
          }
        }
      })
      .on("error", function(err) {
        // handle error
        console.log("ERRROR HANDLING MEDIA");
        return { status: "error", data: err };
      })
      .on("end", function() {
        // final callback
        console.log("finished deleting media");
      });
    await AnswerModel.deleteMany({ question_id: id });
    await QuestionModel.deleteOne({ id: id });
    return { status: "OK", data: "Success" };
  }

  /**
   * gets all question ids posted by user id (milestone 2)
   * @param {String} userID
   */
  async get_questions_by_userID(userID) {
    let found_questions = await QuestionModel.find({ username: userID });
    if (found_questions.length == 0)
      return { status: "error", data: "User has not posted questions yet!" };
    let all_questions = [];
    for (let questions in found_questions) {
      let question_info = await this.question_to_api_format(
        found_questions[questions]
      );
      if (question_info.status == "error")
        return { status: "error", data: "Error fetching question data" };
      else all_questions.push(question_info.data.id);
    }
    return { status: "OK", data: all_questions };
  }

  /**
   * Upvotes a question, or removes upvote, and updates reputation of asker
   * @param {String} questionID
   * @param {Boolean} upvote
   * @param {String} username
   */
  async upvote_question(questionID, upvote, username) {
    const found_question = await QuestionModel.findOne({
      id: questionID
    });
    if (!found_question) {
      return { status: "error" };
    }
    // Convert the boolean from true/false to 1/-1 (default 1)
    upvote = typeof upvote === "undefined" ? 1 : upvote ? 1 : -1;
    const found_upvote = await UpvoteModel.findOne({
      type: "question",
      username: username,
      question_id: questionID
    });
    const found_user = await UserModel.findOne({
      username: found_question.username
    });
    if (!found_user) {
      return { status: "error" };
    }
    // Upvoting after already upvoting undoes it
    if (found_upvote && found_upvote.value === upvote) {
      await UpvoteModel.updateOne(
        {
          question_id: found_upvote.question_id,
          username: username,
          type: "question"
        },
        { value: 0 }
      );
      if (found_user.reputation + -upvote >= 1) {
        await UserModel.updateOne(
          { username: found_question.username },
          { $inc: { reputation: -upvote } }
        );
      }
    } else if (found_upvote) {
      //   console.log("votes changed");
      //   await UpvoteModel.deleteOne(found_upvote); // Might not have to await
      await UpvoteModel.updateOne(
        {
          question_id: found_upvote.question_id,
          username: username,
          type: "question"
        },
        { value: upvote }
      );

      if (found_user.reputation + upvote >= 1) {
        await UserModel.updateOne(
          { username: found_question.username },
          { $inc: { reputation: upvote } }
        );
      }
    } else {
      // Create and save upvote
      const new_upvote = new UpvoteModel({
        type: "question",
        username: username,
        question_id: questionID,
        value: upvote
      });
      await new_upvote.save();

      if (found_user.reputation + upvote >= 1) {
        await UserModel.updateOne(
          { username: found_question.username },
          { $inc: { reputation: upvote } }
        );
      }
    }
    return { status: "OK" };
  }

  async get_question_upvote_status(questionID, username) {
    const found_upvote = await UpvoteModel.findOne({
      type: "question",
      username: username,
      question_id: questionID
    });
    if (!found_upvote) return { status: "error" };
    return { status: "Ok", upvote: found_upvote.value };
  }
};
