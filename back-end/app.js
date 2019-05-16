#!/usr/bin/env node
process.env.UV_THREADPOOL_SIZE = 128;

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
  var http = require('http');
  var agent = new http.Agent({ maxSockets: Number.MAX_VALUE });

  const app = express();
  // Tell express there is a proxy on the same server as the app
  app.set('trust proxy', '127.0.0.1');
  // morgan to log HTTP responses
  const morgan = require("morgan");
  app.use(morgan("dev"));
  const cors = require("cors");
  const parser = require("body-parser");
  const mongoose = require("mongoose");
  // please so it's easier to switch between testing locally
  mongoose.connect("mongodb://127.0.0.1:27017/stackOverflowDB", {
//   mongoose.connect("mongodb://192.168.122.33:27017/stackOverflowDB", {
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
  app.use(parser.urlencoded({ limit:'100mb',  extended: true }));
  app.use(parser.json({ limit:'100mb' }));

  // App routes
  const UserRouter = require("./routes/userRouter");
  const QuestionRouter = require("./routes/questionRouter");
  const AnswerRouter = require("./routes/answerRouters");
  const MediaRouter = require("./routes/mediaRouter");
  const IndexRouter = require("./routes/index")
  app.use("/", [UserRouter, QuestionRouter, AnswerRouter, MediaRouter, IndexRouter]);


  // Run app
  const portNum = process.env.PORT || 4000;
  app.listen(portNum, () =>
    console.log(`Process ${process.pid} is listening on port 4000...`)
  );
}
