/**
 * Class for password hashing using BCrypt
 */

const bcrypt = require('bcryptjs');

const rounds = 15;

module.exports = class Hash {
    /**
     * Hash a password using a salted generated with a number of rounds
     */
    async hashPassword(password) {
        const salt = bcrypt.genSaltSync(rounds);
        return bcrypt.hash(password, salt);
    }

    /**
     * Verify a given password with a hash
     */
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}