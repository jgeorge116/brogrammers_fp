const Mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const Hash = require("./../utils/hash");
const hash = new Hash();
const shortid = require("shortid");
const uuidv4 = require("uuid/v4");
const nodemailer = require("nodemailer");

module.exports = class UserRepository {

  /**
   * Sends a verification email for an user
   * @param {String} username 
   */
  async send_verification(username) {
    if (!username) {
      return { status: "error", data: "Username cannot be empty!" };
    }
    var user_info = await UserModel.findOne({ username: username });
    if (!user_info) {
      return { status: "error", data: "User does not exist to send verification email." };
    }
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
    return { status: "OK", data: "" };
  }

  /**
   * Creates an account with unique username and email and sends a verification email
   * @param {String} username
   * @param {String} password
   * @param {String} email 
   */
  async create(username, password, email) {
    // Check if fields exist
    if (!username) {
      return { status: "error", data: "Username cannot be empty!" };
    }
    if (!password) {
      return { status: "error", data: "Password cannot be empty!" };
    }
    if (!email) {
      return { status: "error", data: "Email cannot be empty!" };
    }
    // Check if username and email are unique
    var not_unique_username = await UserModel.findOne({ username: username });
    if (not_unique_username) {
      return { status: "error", data: "Username exists." };
    }
    var not_unique_email = await UserModel.findOne({ email: email });
    if (not_unique_email) {
      return { status: "error", data: "Email exists." };
    }
    // Store new user
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
    await this.send_verification(username);
    return { status: "OK", error: "" };
  }

  /**
   * Verifies an account
   * @param {String} email
   * @param {String} verificationKey
   */
  async verify(email, verificationKey) {
    // Check if fields exist
    if (!email) {
      return { status: "error", data: "Email cannot be empty!" };
    }
    if (!verificationKey) {
      return { status: "error", data: "Verification key cannot be empty!" };
    }
    var user_info = await UserModel.findOne({ email: email });
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
      data: "Verification key and email comnbination incorrect."
    };
  }

  /**
   * Logs in an account
   * @param {String} username 
   * @param {String} password 
   */
  async login(username, password) {
    // Check if fields exist
    if (!username) {
      return { status: "error", data: "Username cannot be empty!" };
    }
    if (!password) {
      return { status: "error", data: "Password cannot be empty!" };
    }
    var found_user = await UserModel.findOne({ username: username });
    if (!found_user) {
      return { status: "error", data: "User not found." };
    }
    var verified_user = found_user.isVerified;
    if (!verified_user) {
      await this.send_verification(username);
      return { status: "error", data: "Not verified" };
    }
    const check_password = await hash.verifyPassword(
      password,
      found_user.password
    );
    if (check_password) {
      return { status: "OK", data: "User logged in" };
    }
    return { status: "error", data: "Incorrect password provided" };
  }

  /**
   * Resends a verification email with the verification key for an account
   * @param {String} username
   */
  async resend_verification(username) {
    // Check if username exists
    if (!username) {
      return { status: "error", data: "Username cannot be empty!" };
    }
    const result = await this.send_verification(username);
    if (result.status == 'error') {
      return { status: result.status, data: result.data };
    }
    return { status: "OK", data: "Verification email resent." };
  };

  async getUserInfo(username) {
    let found_user = await UserModel.findOne({username: username})
    if (found_user === null) return {status: "error", data: "User not found!!" }
    else return {status: "OK", data: {email: found_user.email, reputation: found_user.reputation}}
  }
};
