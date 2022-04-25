import { ethers } from "ethers";

import "./App.css";
import switchNetwork from "./utils/switchNetwork";
import getContractByProvider from "./utils/getContractByProvider";

const App = () => {
  const subscribe = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    try {
      await contract.subscribe({
        value: ethers.utils.parseEther("0.1"),
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const claim = async (networkName) => {
    switchNetwork(networkName);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    try {
      // await contract.claim(1);
      const myAddress = await provider.getSigner().getAddress();
      console.log(await getRewardsNumber(networkName, myAddress));
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  async function getRewardsNumber(network, address) {
    // Default options are marked with *
    const response = await fetch(
      `http://localhost:3030/subscribers/${address}`,
      {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: network,
        }),
      }
    );
    return response.json(); // parses JSON response into native JavaScript objects
  }

  return (
    <div className="App">
      <button onClick={() => subscribe()}>Subscribe</button>
      <button onClick={() => claim("rinkeby")}> Claim ETH </button>
      <button onClick={() => claim("bsc")}>Claim BNB</button>
      <button onClick={() => claim("mumbai")}>Claim MATIC</button>
    </div>
  );
};

export default App;
