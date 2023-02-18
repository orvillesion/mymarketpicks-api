// Library import
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

// Utilities import
require('dotenv').config({ path: '../.env'});
const { encryptData, decryptData } = require('../utils/rsa');
const { objectIDValidator } = require('../utils/validator')

module.exports.generateToken = async = (key, payload) => {
    switch (key) {
        case 'user':
            return jwt.sign(payload, process.env.USER_ACCESS_TOKEN, { expiresIn: '1d' });
        case 'rider':
            return jwt.sign(payload, process.env.RIDER_ACCESS_TOKEN, { expiresIn: '1d' });
        case 'store':
            return jwt.sign(payload, process.env.SELLER_ACCESS_TOKEN, { expiresIn: '1d' });
        case 'admin':
            return jwt.sign(payload, process.env.ADMIN_ACCESS_TOKEN, { expiresIn: '1d' });  
        default:
            throw new Error("Invalid Key");   
    }
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