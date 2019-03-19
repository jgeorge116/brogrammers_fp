/**
 * JWT generation and verification
 */
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports = class Authentication {
  constructor() {
    const keys = path.join(__dirname, "..");
    this.public = fs.readFileSync(`${keys}/public.key`, "utf8").toString();
    this.private = fs.readFileSync(`${keys}/private.key`, "utf8").toString();
  }

  /**
   * Generate a JWT token with an expiration time
   */
  async generate(username) {
    return jwt.sign(
      {
        username: username
      },
      this.private,
      {
        algorithm: "RS256",
        expiresIn: "1 day"
      }
    );
  }

  /**
   * Validate a JWT token, an error will be thrown if the token is tampered with if expired.
   * @returns {object} - Object with username, iat, and exp (empty if error)
   */
  async validate(token) {
    try {
      return jwt.verify(token, this.public, {
        algorithms: ["RS256"]
      });
    } catch(e) {
      return {};
    }
  }
};
