const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const crypto = require('crypto');

const { SECRET_KEY } = siteConfig;

const options = {
    algorithm : 'HS256',
    issuer : 'Administrator'
}

const token = {
    getRandToken(len=64) {
        return randToken.generate(len);
    },
    generatePassword(password) {
        return crypto.pbkdf2Sync(password, SECRET_KEY, 10, 64, 'sha512').toString('base64');
    },
    getToken(user) {
        const payload = {
            user_id : user.user_id
        };
        return jwt.sign(payload, SECRET_KEY, options);
    },
    verify(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (e) {
            return { error : e.message };
        }
    }
};

module.exports = token;