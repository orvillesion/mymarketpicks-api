const nodeRSA = require('node-rsa');
const key = new nodeRSA({b: 512});

module.exports.encryptData = (text) => {
    return key.encrypt(text, 'base64');
}

// Not working properly
module.exports.decryptData = (encrypt) => {
    return key.decrypt(encrypt, 'utf8');
}