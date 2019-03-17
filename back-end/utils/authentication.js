/**
 * JWT generation and verification
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.export = class Authentication {
    constructor(repository) {
        this.repository = repository;
        const keys = path.join(__dirname, '..');
        this.public = fs.readFileSync(`${key}/public.key`, 'utf8').toString();
        this.private = fs.readFileSync(`${key}/private.key`, 'utf8').toString();
    }

    /**
     * Generate a JWT token with an expiration time
     */
    generate(userModel) {
        return jwt.sign(
            {
                email: userModel.email,
                username: userModel.username
            },
            this.secret,
            {
                algorithm: 'RS256',
                expiresIn: '1 day'
            }
        )
    }

    /**
     * Validate a JWT token, an error will be thrown if the token is tampered with if expired.
     */
    async validate(token) {
        return jwt.verify(
            token,
            this.public,
            {
                algorithms: ['RS256']
            }
        );
    }
}