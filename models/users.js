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
  house_number: Number,
  barangay: String,
  municipality: String,
  region: String,
  landmark: String,
  additional_information: String,
  priority: Number,
  address_category: String,
});

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

const userLocation = mongoose.Schema({
  geometry: geoSchema,
  date_time: {
    type: Date,
    default: () => Date.now()
  },
});

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        immutable: true,
        lowercase: true,
        index: true
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
