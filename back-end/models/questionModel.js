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
      timestamp: {type: Number, es_type: 'double'}
  },
  { autoIndex: false }
);
QuestionModelSchema.set("collection", "questions");
// QuestionModelSchema.index({title:'text',body:'text'});
//QuestionModelSchema.plugin(mongoosastic, {
//  host: "192.168.122.49",
//  port: 9200
//});

client.indices.exists({index: 'questions'}, (err, res, status) => {
    if (res) {
	//console.log(res);
        console.log('index already exists');
    }else {
	client.indices.create( {index: 'questions'}, (err, res, status) => {
            //console.log(err, res, status);
	});
	client.indices.putMapping({
    index: 'questions',
    type: 'question',
    body:{
	properties: {
	    id: { type: 'text' },
	    username: {type: 'text'},
	    title: { type: 'text' },
	    body: { type: 'text'},
	    tags: { type: 'text'},
	    media: { type: 'text'},
	    accepted_answer_id: { type: 'text'},
	    timestamp: {type:'integer'},
	    falafel: {type: 'text'}
	}
    }
}, (err,resp, status) => {
    if (err) {
	console.error(err, status);
    }
    else {
	console.log('Successfully Created Index', status, resp);
    }
});

    }});
var questionModel = mongoose.model("QuestionModel", QuestionModelSchema);
module.exports = questionModel;

