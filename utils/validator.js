// Library imports
const ObjectId = require("mongoose").Types.ObjectId;

// Checks if the object id is valid
module.exports.objectIDValidator = (id) => {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
    }
}

// Checks if the email format is valid
module.exports.emailValidator = (email) => {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regex)) return true
    return false
}

module.exports.stringInputTrimmer = (text) => {
    return text.replace(/\s+/g, '')
}