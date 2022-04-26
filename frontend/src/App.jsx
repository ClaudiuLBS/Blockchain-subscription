import { ethers } from "ethers";
import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

import "./App.css";
import switchNetwork from "./utils/switchNetwork";
import getContractByProvider from "./utils/getContractByProvider";
import LoadingScreen from "./components/LoadingScreen";

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChain, setCurrentChain] = useState(4);
  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  useEffect(() => {
    checkForErrors();
  }, []);

  const checkForErrors = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const { chainId } = await provider.getNetwork();
        setCurrentChain(parseInt(chainId));

        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Connect to your account");
      }
    } else setErrorMessage("install metamask");
  };

  window.ethereum.on("accountsChanged", (accounts) => {
    checkForErrors();
  });

  window.ethereum.on("chainChanged", async (chainId) => {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    setCurrentChain(parseInt(chainId));
  });

  const subscribe = async () => {
    const contract = await getContractByProvider(provider);
    let price = "0.1";
    if (currentChain == 97) price = "0.06";
    else if (currentChain == 80001) price = "0.2";
    try {
      const data = await contract.subscribe({
        value: ethers.utils.parseEther(price), //aici va trebui o functie care alege valoarea abonamentului in functie de retea
      });
      console.log(data);
      setLoading(true);
      provider.once(data.hash, (transaction) => {
        setLoading(false);
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const claim = async () => {
    const contract = await getContractByProvider(provider);
    const myAddress = await provider.getSigner().getAddress();

    let bigNumber;
    bigNumber = await contract.getNextClaimDate(myAddress);
    const nextClaimDate = parseInt(bigNumber._hex);

    bigNumber = await contract.getRegistrationDate(myAddress);
    const lastClaimDate = parseInt(bigNumber._hex) + 300;

    try {
      const response = await fetch(`http://localhost:3030/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nextClaimDate,
          lastClaimDate,
        }),
      });
      const totalRewards = await response.json();
      if (totalRewards > 0) await contract.claim(totalRewards, myAddress);
      console.log(totalRewards);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  if (errorMessage.length > 0)
    return <Alert severity="error">{errorMessage}</Alert>;

  return (
    <div className="App">
      <div className="container">
        <Button
          className="subscribeButton"
          color="success"
          variant="contained"
          onClick={() => subscribe()}
        >
          Subscribe
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            currentChain == 4 ? claim("rinkeby") : switchNetwork("rinkeby")
          }
        >
          {currentChain == 4 ? "Claim ETH" : "Switch to rinkeby"}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            currentChain == 97 ? claim("bsc") : switchNetwork("bsc")
          }
        >
          {currentChain == 97 ? "Claim BNB" : "Switch to bsc testnet"}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            currentChain == 80001 ? claim("mumbai") : switchNetwork("mumbai")
          }
        >
          {currentChain == 80001 ? "Claim MATIC" : "Switch to mumbai"}
        </Button>
      </div>
      <LoadingScreen open={loading} />
    </div>
  );
};

export default App;
