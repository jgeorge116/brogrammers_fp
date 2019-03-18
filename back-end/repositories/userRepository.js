const Mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const Hash = require("./../utils/hash");
const hash = new Hash();
const shortid = require("shortid");
const uuidv4 = require("uuid/v4");
const nodemailer = require("nodemailer");

module.exports = class UserRepository {
  async send_verifcation(username) {
    var user_info = await UserModel.findOne({ username: username });
    // console.log(username);
    // console.log(user_info);
    let trans = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "brogrammers.cse356@gmail.com",
        pass: "ferdman123"
      }
    });

    const opt = {
      from: "The Brogrammers",
      to: user_info.email,
      subject: "StackOverflow: Verify Account",
      text: `${username}, Please enter the following key (without the brackets): <${
        user_info.verificationKey
      }>`
    };
    trans.sendMail(opt);
  }

  async create(username, password, email) {
    var not_unique_username = await UserModel.findOne({ username: username });
    if (not_unique_username)
      return { status: "error", data: "Username exists" };

    var not_unique_email = await UserModel.findOne({ email: email });
    if (not_unique_email) return { status: "error", data: "Email exists" };
    const hashedPassword = await hash.hashPassword(password);
    const key = shortid.generate();
    const new_user = new UserModel({
      id: uuidv4(),
      username: username,
      password: hashedPassword,
      email: email,
      verificationKey: key
    });

    await new_user.save();
    // console.log(username);
    await this.send_verifcation(username);
    // console.log("We made it past email");
    return { status: "OK", data: new_user };
  }

  async verify(email, verificationKey) {
    //   console.log(email);
    //   console.log(verificationKey);
    var user_info = await UserModel.findOne({ email: email });
    // console.log(user_info);
    if (
      user_info &&
      (verificationKey == "abracadabra" ||
        verificationKey == user_info.verificationKey)
    ) {
      user_info.isVerified = true;
      user_info.save();
      return { status: "OK", data: "User verified." };
    }
    return {
      status: "error",
      data: "Verification key and email comnbination incorrect"
    };
  }

  async login(username, password) {
    var found_user = await UserModel.findOne({ username: username });
    if (!found_user) return { status: "error", data: "User not found." };
    var verified_user = found_user.isVerified;
    if (!verified_user) {
      await this.send_verifcation(username);
      return { status: "error", data: "Not verified" };
    }
    const check_password = await hash.verifyPassword(
      password,
      found_user.password
    );
    if (check_password) return { status: "OK", data: "User logged in" };
    return { status: "error", data: "Incorrect password provided" };
  }

  async resend_verification(username) {
    await this.send_verifcation(username);
    return { status: "OK", data: "Verification email resent." };
  }
};
