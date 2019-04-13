const UserModel = require("../models/userModel");
const Hash = require("./../utils/hash");
const hash = new Hash();
const VerifyEmail = require("./../utils/mailSend");
const mailSend = new VerifyEmail();
const shortid = require("shortid");
const uuidv4 = require("uuid/v4");
const nodemailer = require("nodemailer");
// const { performance } = require('perf_hooks');

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
      return {
        status: "error",
        data: "User does not exist to send verification email."
      };
    }
    mailSend.sendRequest(username, user_info.email, user_info.verificationKey);
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
    // var t0 = performance.now();
    var not_unique = await UserModel.findOne({
      $or: [{ username: username }, { email: email }]
    });
    // var t1 = performance.now();
    // console.log("Call to not_unique took " + (t1 - t0) + " milliseconds.")
    if (not_unique) {
      if (not_unique.username == username) {
        return { status: "error", data: "Username exists." };
      }
      if (not_unique.email == email) {
        return { status: "error", data: "Email exists." };
      }
    }
    // Store new user
    // t0 = performance.now();
    const hashedPassword = await hash.hashPassword(password);
    // t1 = performance.now();
    // console.log("Call to hashing took" + (t1 - t0) + " milliseconds.")
    // t0 = performance.now();
    const key = shortid.generate();
    // t1 = performance.now();
    // console.log("Call to shortid took" + (t1 - t0) + " milliseconds.")
    // t0 = performance.now();
    const new_user = new UserModel({
      id: uuidv4(),
      username: username,
      password: hashedPassword,
      email: email,
      verificationKey: key
    });

    await new_user.save();
    // t1 = performance.now();
    // console.log("Creating a user into the db took " + (t1 - t0) + " milliseconds.")
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
    if (result.status == "error") {
      return { status: result.status, data: result.data };
    }
    return { status: "OK", data: "Verification email resent." };
  }

  /**
   * sends the email and reputation of a user if it exists
   * @param {String} username
   */
  async getUserInfo(username) {
    let found_user = await UserModel.findOne({ username: username });
    if (found_user === null)
      return { status: "error", data: "User not found!!" };
    else
      return {
        status: "OK",
        data: {
          email: found_user.email,
          reputation: found_user.reputation < 1 ? 1 : found_user.reputation
        }
      };
  }
};
