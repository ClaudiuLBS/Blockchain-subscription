require("dotenv").config();
const express = require("express");
const app = express();
const contracts = require("./contracts");

app.use(express.json());

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

app.listen(3030, () => console.log(`Listening to http://localhost:3030/`));
