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

module.exports = items = mongoose.model("items", itemSchema);