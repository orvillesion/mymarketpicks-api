const mongoose = require('mongoose');

const userCartSchema = mongoose.Schema({
    user_id: mongoose.ObjectId,
    store_id: mongoose.ObjectId,
    item_id: mongoose.ObjectId,
    quantity: Number,
    date_time: {
        type: Date,
        default: () => Date.now()
    }
}, { timestamps: true })

const userAddressSchema = mongoose.Schema({
  barangay: String,
  municipality: String,
  landmark: String,
  priority: Number
});

const userLocation = mongoose.Schema({
  date_time: {
    type: Date,
    default: () => Date.now()
  },
  location_coordinates: String
});

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        immutable: true,
        lowercase: true
    },
    mobile: String,
    password: String,
    address: [userAddressSchema],
    mode_payment: {
      type: Array,
      default: [],
    },
    user_type: String,
    messenger_name: String,
    account_status: Boolean,
    account_verified: Boolean,
    location: [userLocation],
    user_cart: [userCartSchema],
    user_image: {
        type: String,
        contentType: String
    }
  }, { timestamps: true });

module.exports = users = mongoose.model("users", userSchema);
