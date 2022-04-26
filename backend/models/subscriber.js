const mongoose = require("mongoose");
//asta e un fel de clasa, obiectele instantiate le bagam in baza de date
//va trebui sa ii contorizam si nr de claimuri, ca sa stim cand sa ii inchidem abonamentul
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
