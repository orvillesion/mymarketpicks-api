const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    store_id: mongoose.ObjectId,
    date_added: {
        type: Date,
        default: () => Date.now()
    },
    item_name: String,
    category: String,
    type: String,
    price: Number,
    quantity: Number,
    units: Number,
    description: String,
    img_path: {
        type: String,
        contentType: String
    }
}, { timestamps: true });


const storeSchema = mongoose.Schema({
    owner_id: mongoose.ObjectId,
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
    items: [itemSchema]

}, { timestamps: true });

module.exports = stores = mongoose.model("stores", storeSchema);