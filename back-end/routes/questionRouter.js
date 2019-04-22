const express = require("express");
const router = express.Router();

var QuestionController = require("../controllers/questionController");

router.post("/questions/add", QuestionController.add_question);
router.get("/questions/:id", QuestionController.get_question_by_id);
router.post("/search", QuestionController.search_questions);
router.delete("/questions/:id", QuestionController.delete_question_by_id);
router.get("/user/:id/questions", QuestionController.get_user_questions);
router.post("/questions/:id/upvote", QuestionController.upvote_question);
router.get("/questions/:id/upvotestatus", QuestionController.get_question_upvote_status);
module.exports = router;
