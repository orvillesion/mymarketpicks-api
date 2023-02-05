const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

require('dotenv').config({ path: '../.env'});

module.exports.generateAccessToken = async = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
}