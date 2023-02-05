const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    owner_id: mongoose.ObjectId,
    user_id: {
        type: Array,
        default: []
    },
    store_name: String,
    mobile: String,
    address: String,
    barangay: String,
    municipality: String,
    province: String,
    landmark: {
        type: Array,
        default: []
    },
    location: String,
    store_coordinates: {
        type: String,
    },
    rating: Number

}, { timestamps: true });

module.exports = stores = mongoose.model("stores", storeSchema);