const mongoose = require('mongoose');

const userCartSchema = mongoose.Schema({
    user_id: mongoose.ObjectId,
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
  landmark: { 
    type: Array,
    default: []
  }
})

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
    username: {
      type: String,
      immutable: true
    },
    address: [userAddressSchema],
    money: {
      type: Array,
      default: [],
    },
    user_type: String,
    store_id: {
      type: Array,
      default: [],
    },
    messenger_name: String,
    account_status: String,
    user_cart: [userCartSchema],
    user_image: {
        type: String,
        contentType: String
    }
  }, { timestamps: true });

module.exports = users = mongoose.model("users", userSchema);
