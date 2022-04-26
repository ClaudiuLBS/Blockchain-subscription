const express = require("express");
const ethers = require("ethers");
const Subscriber = require("../models/subscriber");
const Subscription = require("../../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");
const contracts = require("../contracts");

// const day = 86400000;
const day = 60000; // de test, am zis ca o zi = 1 minut

const router = express.Router();
const subscribe = async (address) => {
  //se creeaza un obiect de tip Subscriber
  const subscriberObject = new Subscriber({
    _id: address,
    address: address,
    registrationDate: Date.now(),
    nextRinkebyRewardDate: Date.now() + day,
    nextBscRewardDate: Date.now() + day,
    nextMumbaiRewardDate: Date.now() + day,
  });
  await subscriberObject.save();
};

//acel event transmis in contract, ascultat pe fiecare chain
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

//aici e api-ul
//returnam toti subscriberii
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//returnam subscriberul cu adresa respectiva
//Acel "getSubscriber" e ceva middleware. Din cate am inteles se executa inainte de functia din acolade
//functia "getSubscriber" e jos de tot
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

//asta o sa il stergem, il folosesc doar de test ca sa nu platesc de fiecare data cand vreau sa dau subscribe
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    _id: req.body.address,
    address: req.body.address,
    registrationDate: Date.now(),
    nextRinkebyRewardDate: Date.now() + day,
    nextBscRewardDate: Date.now() + day,
    nextMumbaiRewardDate: Date.now() + day,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//mai jos e "router.put(...)", functia de mai jos e folosita pt ca avem rewarduri diferite pe fiecare chain
//aici luam valoarea veche
const getNextRewardDateByChain = (res, chain) => {
  if (chain == "rinkeby") return res.subscriber.nextRinkebyRewardDate;
  if (chain == "bsc") return res.subscriber.nextBscRewardDate;
  if (chain == "mumbai") return res.subscriber.nextMumbaiRewardDate;
};
//aici ii atribuim noua valoare
const setNextRewardDateByChain = (res, chain, value) => {
  if (chain == "rinkeby") res.subscriber.nextRinkebyRewardDate = value;
  if (chain == "bsc") res.subscriber.nextBscRewardDate = value;
  if (chain == "mumbai") res.subscriber.nextMumbaiRewardDate = value;
};

router.put("/:id", getSubscriber, async (req, res) => {
  //de ex daca au trecut 3 zile si nu ai dat claim, totalRewards va fi 3
  //apoi in contract in functia de claim, se trimite abonatului totalRewards x valoarea unui claim
  let totalRewards = 0;
  const chain = req.body.chain; // asta e chain-ul dat ca parametru in frontend, la acel fetch
  let nextRewardDate = getNextRewardDateByChain(res, chain);
  //aici numaram cat timp a trecut de la data cand putea da claim
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

//stergem un subscriber, nu cred ca vom avea nevoie de asta, o sa il stergem direct cand se termina abonamentul
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Deleted Subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//asta e acel middleware, returneaza un subscriber dupa id
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
