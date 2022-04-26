import { ethers } from "ethers";

import "./App.css";
import switchNetwork from "./utils/switchNetwork";
import getContractByProvider from "./utils/getContractByProvider";

const day = 2;

const App = () => {
  const subscribe = async () => {
    //alegem contractul in functie de reteaua pe care ne aflam (rinkeby/bsc/mumbai)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);

    try {
      await contract.subscribe({
        value: ethers.utils.parseEther("0.01"), //aici va trebui o functie care alege valoarea abonamentului in functie de retea
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const claim = async (networkName) => {
    switchNetwork(networkName); //de ex, cand dam claim la bnb tre sa schimbam pe reteaua bsc testnet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);

    const myAddress = await provider.getSigner().getAddress();
    const nextClaimDate = parseInt(
      (await contract.nextClaimDate(myAddress))._hex
    );
    const lastClaimDate =
      parseInt((await contract.registrationDate(myAddress))._hex) + 60;
    console.log(myAddress, networkName, nextClaimDate, lastClaimDate);
    try {
      const response = await fetch(`http://localhost:3030/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: networkName,
          address: myAddress,
          nextClaimDate,
          lastClaimDate,
        }),
      });
      const totalRewards = await response.json();
      // contract.claim(totalRewards, myAddress);
      console.log(totalRewards);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

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
