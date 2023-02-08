const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        immutable: true,
        lowercase: true,
        unique: true
    },
    password: String,
    userType: {
        Type: String,
        immutable: true,
        default: "priority-admin"
    },
    status: boolean
})

module.exports = admin = mongoose.model("admin", adminSchema);