const express = require("express");
const ethers = require("ethers");
const Subscriber = require("../models/subscriber");
const Subscription = require("../../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");
const contracts = require("../contracts");

// const day = 86400000;
const day = 60000;

const router = express.Router();
const subscribe = async (address) => {
  const subscriberObject = new Subscriber({
    _id: address,
    address: address,
    registrationDate: Date.now(),
    nextRinkebyRewardDate: Date.now() + day,
    nextBscRewardDate: Date.now() + day,
    nextMumbaiRewardDate: Date.now() + day,
  });
  const newSubscriber = await subscriberObject.save();
  console.log(newSubscriber);
};

contracts.rinkeby.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.bsc.subscribeToCurrentChain(subscriberAddress);
  await contracts.mumbai.subscribeToCurrentChain(subscriberAddress);
  subscribe(subscriberAddress);
});

contracts.bsc.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.rinkeby.subscribeToCurrentChain(subscriberAddress);
  await contracts.mumbai.subscribeToCurrentChain(subscriberAddress);
  subscribe(subscriberAddress);
});

contracts.mumbai.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.bsc.subscribeToCurrentChain(subscriberAddress);
  await contracts.rinkeby.subscribeToCurrentChain(subscriberAddress);
  subscribe(subscriberAddress);
});

// Getting all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    address: req.body.address,
    registrationDate: Date.now(),
    nextRinkebyRewardDate: Date.now() + day,
    nextBscRewardDate: Date.now() + day,
    nextMumbaiRewardDate: Date.now() + day,
    _id: req.body.address,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const getNextRewardDateByChain = (res, chain) => {
  if (chain == "rinkeby") return res.subscriber.nextRinkebyRewardDate;
  if (chain == "bsc") return res.subscriber.nextBscRewardDate;
  if (chain == "mumbai") return res.subscriber.nextMumbaiRewardDate;
};
const setNextRewardDateByChain = (res, chain, value) => {
  if (chain == "rinkeby") res.subscriber.nextRinkebyRewardDate = value;
  if (chain == "bsc") res.subscriber.nextBscRewardDate = value;
  if (chain == "mumbai") res.subscriber.nextMumbaiRewardDate = value;
};
// Updating One
router.put("/:id", getSubscriber, async (req, res) => {
  let totalRewards = 0;
  const chain = req.body.chain;
  let nextRewardDate = getNextRewardDateByChain(res, chain);
  while (nextRewardDate < Date.now()) {
    totalRewards++;
    nextRewardDate += day;
  }
  setNextRewardDateByChain(res, chain, nextRewardDate);
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(totalRewards);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Deleting One
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Deleted Subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}

module.exports = router;
