const cluster = require("cluster");

if (cluster.isMaster) {
  var numberOfCPU = require("os").cpus().length;
  for (var i = 0; i < numberOfCPU; i++) {
    cluster.fork();
    cluster.on("exit", function(worker, code, signal) {
      console.log("Worker died. Starting a new one.");
      cluster.fork();
    });
  }
} else {
  const express = require("express");
  const app = express();
  // Tell express there is a proxy on the same server as the app
  app.set('trust proxy', '127.0.0.1');
  // morgan to log HTTP responses
  const morgan = require("morgan");
  app.use(morgan("dev"));
  const cors = require("cors");
  const parser = require("body-parser");
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost:27017/stackOverflowDB", {
    useCreateIndex: true,
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  };

  app.use(cors(corsOptions));
  app.use(parser.urlencoded({ extended: true }));
  app.use(parser.json());

  // App routes
  const UserRouter = require("./routes/userRouter");
  const QuestionRouter = require("./routes/questionRouter");
  const AnswerRouter = require("./routes/answerRouters");
  app.use("/", [UserRouter, QuestionRouter, AnswerRouter]);


  // Run app
  const portNum = process.env.PORT || 4000;
  app.listen(portNum, () =>
    console.log(`Process ${process.pid} is listening on port 4000...`)
  );
}
