const QuestionModel = require("../models/questionModel");
const AnswerModel = require("../models/answerModel");
const UserModel = require("../models/userModel");
const ViewQuestionModel = require("../models/viewQuestionModel");
const UpvoteModel = require("../models/upvoteModel");

const cassandra = require("cassandra-driver");
const client = new cassandra.Client({
  contactPoints: ["192.168.122.50"],
  // contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1"
});

module.exports = class ResetRespository {
  /**
   * Remove all the data from mongo and cassandra
   */
  async reset_databases() {
    await UserModel.deleteMany({});
    await QuestionModel.deleteMany({});
    await AnswerModel.deleteMany({});
    await ViewQuestionModel.deleteMany({});
    await UpvoteModel.deleteMany({});

    client.connect(function(err, result) {
      if (err) console.log(err);
      else console.log("cassandra connected");
    });

    var query1 =
      "CREATE KEYSPACE IF NOT EXISTS somedia WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1' : '1' }";
    await client.execute(query1, function(err) {
      if (err) console.log(err);
      else console.log("created keyspace somedia");
    });

    var query3 =
      "CREATE TABLE IF NOT EXISTS somedia.media (id text PRIMARY KEY, contents blob, username text); ";
    await client.execute(query3, function(err) {
      if (err) console.log(err);
      else console.log("created table media");
    });
    3;
    var query2 = "TRUNCATE somedia.media";
    await client.execute(query2, function(err) {
      if (err) console.log(err);
      else console.log("erase somedia");
    });
  }
};
