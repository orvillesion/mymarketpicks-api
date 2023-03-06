const mongoose = require('mongoose');

const geoSchema = mongoose.Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

const riderSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
    },
    password: String,
    first_name: String,
    last_name: String,
    birth_date: Date,
    mobile: String,
    user_type: String,
    account_status: Boolean,
    account_verified: Boolean,
    house_number: Number,
    barangay: String,
    municipality: String,
    region: String,
    rider_credits: Number,
    email: {
        type: String,
        unique: true,
        immutable: true,
        lowercase: true,
        index: true
    },
});

module.exports = riders = mongoose.model("riders", riderSchema);