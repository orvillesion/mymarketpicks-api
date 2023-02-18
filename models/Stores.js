const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    item_name: String,
    category: String,
    type: String,
    price: Number,
    quantity: Number,
    units: Number,
    description: String,
    discount: Number,
    unavailable_area: {
        type: Array,
        default: []
    },
    img_path: {
        type: String,
        contentType: String
    },
}, { timestamps: true });


const storeSchema = mongoose.Schema({
    store_name: String,
    mobile: String,
    address: String,
    barangay: String,
    municipality: String,
    province: String,
    landmark: String,
    store_coordinates: {
        type: String,
    },
    rating: Number,
    items: [itemSchema],
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
}, { timestamps: true });

module.exports = stores = mongoose.model("stores", storeSchema);