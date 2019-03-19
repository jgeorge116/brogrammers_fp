const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const parser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const shortid = require("shortid");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stackOverflowDB', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// const routes = require("./routes/index");
const UserRouter = require("./routes/userRouter");
const QuestionRouter = require("./routes/questionRouter");
app.use("/", [UserRouter, QuestionRouter]);
// const routs = new UserRouter();

const portNum = process.env.PORT || 4000;
app.listen(portNum, () => console.log("Web server listening on port 4000..."));
