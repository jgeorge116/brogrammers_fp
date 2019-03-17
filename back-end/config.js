/**
 * Global app config file
 */

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const password = fs.readFileSync(path.join(__dirname, 'emailpassword'), 'utf8').toString();

export default {
    app: {
        PORT,
        api_route: 'api',
        api_ver: 'v1',
        email: 'brogrammers.cse356@gmail.com',
        password: password
    },
    database: {
        servers: [
            '130.245.171.174:27017'
        ],
        name: 'stackOverflowDB'
    }
};