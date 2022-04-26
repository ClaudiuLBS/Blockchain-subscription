import { ethers } from "ethers";

import "./App.css";
import switchNetwork from "./utils/switchNetwork";
import getContractByProvider from "./utils/getContractByProvider";

const App = () => {
  const subscribe = async () => {
    //alegem contractul in functie de reteaua pe care ne aflam (rinkeby/bsc/mumbai)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    try {
      await contract.subscribe({
        value: ethers.utils.parseEther("0.1"), //aici va trebui o functie care alege valoarea abonamentului in functie de retea
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const claim = async (networkName) => {
    switchNetwork(networkName); //de ex, cand dam claim la bnb tre sa schimbam pe reteaua bsc testnet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    try {
      const myAddress = await provider.getSigner().getAddress();
      const rewardsNumber = await getRewardsNumber(networkName, myAddress); //nr de zile de la ultimul claim
      // await contract.claim(rewardsNumber);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  async function getRewardsNumber(chain, address) {
    const response = await fetch(
      `http://localhost:3030/subscribers/${address}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chain }),
      }
    );
    //in baza de date se va modifica data pt urmatorul reward, pe chain-ul dat ca parametru
    return response.json();
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
