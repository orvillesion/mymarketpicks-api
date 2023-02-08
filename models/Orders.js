const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    time_ordered: {
      type: Date,
      default: () => Date.now(),
    },
    user_id: mongoose.ObjectId,
    rider_id: mongoose.ObjectId,
    store_id: mongoose.ObjectId,
    items: {
      type: Array,
      default: [],
    },
    quantity: Number,
    delivery_fee: Number,
    amount: Number,
    total: Number,
    address: String,
    landmark: {
        type: Array,
        default: []
    },
    order_code: String,
    instructions: String,
    status: String
  },
  { timestamps: true }
);

module.exports = orders = mongoose.model("orders", orderSchema);
