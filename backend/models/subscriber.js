const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Number,
    require: true,
  },
  nextRinkebyRewardDate: {
    type: Number,
    required: true,
  },
  nextBscRewardDate: {
    type: Number,
    required: true,
  },
  nextMumbaiRewardDate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
