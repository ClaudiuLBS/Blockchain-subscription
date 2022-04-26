const express = require("express");
const ethers = require("ethers");
const Subscriber = require("../models/subscriber");
const Subscription = require("../../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");
const contracts = require("../contracts");

// const day = 86400;
const day = 2; // de test, am zis ca o zi = 1 minut

const router = express.Router();

//acel event transmis in contract, ascultat pe fiecare chain
contracts.rinkeby.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.bsc.subscribeToCurrentChain(subscriberAddress);
  await contracts.mumbai.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

contracts.bsc.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.rinkeby.subscribeToCurrentChain(subscriberAddress);
  await contracts.mumbai.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

contracts.mumbai.on("SomeoneSubscribed", async (subscriberAddress) => {
  await contracts.bsc.subscribeToCurrentChain(subscriberAddress);
  await contracts.rinkeby.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

//aici luam valoarea veche
const getContractByChain = (chain) => {
  if (chain == "rinkeby") return contracts.rinkeby;
  if (chain == "bsc") return contracts.bsc;
  if (chain == "mumbai") return contracts.mumbai;
};

router.post("/", async (req, res) => {
  let totalRewards = 0;
  const chain = req.body.chain; // asta e chain-ul dat ca parametru in frontend, la acel fetch
  const myAddress = req.body.address;
  const contract = getContractByChain(chain);
  let nextClaimDate = req.body.nextClaimDate;
  let lastClaimDate = req.body.lastClaimDate;
  //aici numaram cat timp a trecut de la data cand putea da claim
  console.log(nextClaimDate, lastClaimDate);
  while (
    nextClaimDate < Math.floor(Date.now() / 1000) &&
    nextClaimDate < lastClaimDate
  ) {
    totalRewards++;
    nextClaimDate += day;
  }
  console.log(nextClaimDate, lastClaimDate);

  if (nextClaimDate > lastClaimDate) {
    // incheiere abonament
    contracts.rinkeby.unsubscribe(myAddress);
    contracts.bsc.unsubscribe(myAddress);
    contracts.mumbai.unsubscribe(myAddress);
    console.log("unsubscribed");
  }
  try {
    res.json(totalRewards);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
