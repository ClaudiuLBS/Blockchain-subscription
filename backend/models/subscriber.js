const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  subscribed: {
    type: String,
    required: true,
    default: false,
  },
  totalRewards: {
    type: Number,
    required: true,
    default: 0,
  },
  registrationDate: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  nextRewardDate: {
    type: Date,
    required: true,
    default: Date.now() + 30 * 86400,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
