const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

require('dotenv').config({ path: '../.env'});
const { encryptData, decryptData } = require('../utils/rsa');
const { objectIDValidator } = require('../utils/validator')

module.exports.generateAccessToken = async = (payload) => {
    //const encrypt = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
    // return encryptData(encrypt);
    return jwt.sign(payload, process.env.USER_ACCESS_TOKEN, { expiresIn: '1d' });
}

module.exports.extractID = async (request) => {
    try {
        // if(request === null || request === undefined) { 
        //     return false;
        // }
        // const encrypted = decryptData(request);
        const decode = await jwtDecode(request);
        return decode.id
    } catch (error) {
        return false;
    }
}