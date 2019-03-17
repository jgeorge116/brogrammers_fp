const Mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const Hash = require("./../utils/hash");
const shortid = require('shortid');
const nodemailer = require('nodemailer');

module.exports = class UserRepository {
  async create(username, password, email) {
    var not_unique_username = await UserModel.findOne({ user: username });
    if (not_unique_username)
      return { status: "error", data: "username exists" };

    var not_unique_email = await UserModel.findOne({ email: email });
    if (not_unique_email) return { status: "error", data: "email exists" };

    // else if (err) res.send({ status: "error" });
    // move res error to somehwere else
    //   bcrypt.genSalt(saltRounds, (serr, salt) => {
    //     bcrypt.hash(req.body.pwd, salt, (err, hash) => {
    //   if (err) res.send({ status: "error" });
    const hash = new Hash();
    const hashedPassword = await hash.hashPassword(password);
    const key = shortid.generate();
    const new_user = new UserModel({
      username: username,
      password: hashedPassword,
      email: email,
      verification_key: key,
      isVerified: false
    });

    new_user.save();

    let trans = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "brogrammers.cse356@gmail.com",
        pass: "ferdman123"
      }
    });

    const opt = {
      from: "The Brogrammers",
      to: email,
      subject: "StackOverflow: Verify Account",
      text: `${
        username
      }, Please enter the following key (without the brackets): <${key}>`
    };
    trans.sendMail(opt);
    return { status: "OK", data: new_user };
  }
}
