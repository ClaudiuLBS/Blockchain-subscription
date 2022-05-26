import express, { json } from "express";
import { rinkeby, bsc, mumbai } from "./contracts.js";

const app = express();
app.use(json());

rinkeby.on("SomeoneSubscribed", async (subscriberAddress) => {
  await bsc.subscribeToCurrentChain(subscriberAddress);
  await mumbai.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

bsc.on("SomeoneSubscribed", async (subscriberAddress) => {
  await rinkeby.subscribeToCurrentChain(subscriberAddress);
  await mumbai.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

mumbai.on("SomeoneSubscribed", async (subscriberAddress) => {
  await bsc.subscribeToCurrentChain(subscriberAddress);
  await rinkeby.subscribeToCurrentChain(subscriberAddress);
  console.log("subscribed");
});

app.listen(3030, () => console.log(`Listening to http://localhost:3030/`));
