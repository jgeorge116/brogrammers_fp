const express = require("express");
const router = express.Router();

var AnswerController = require("../controllers/answerController");

router.post("/questions/:id/answers/add", AnswerController.add_answer);
router.get("/questions/:id/answers", AnswerController.get_question_answers);
router.get("/user/:id/answers", AnswerController.get_user_answers);
router.post("/answers/:id/upvote", AnswerController.upvote_answer);
router.post("/answers/:id/accept", AnswerController.accept_answer);

module.exports = router;
