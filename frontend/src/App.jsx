import { ethers } from "ethers";
import { Alert, Button } from "@mui/material";
import { useEffect, useState } from "react";

import "./App.css";
import switchNetwork from "./utils/switchNetwork";
import getContractByProvider from "./utils/getContractByProvider";
import LoadingScreen from "./components/LoadingScreen";

const day = 10;

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChain, setCurrentChain] = useState(4);

  useEffect(() => {
    checkForErrors();
  }, []);

  const checkForErrors = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
    setCurrentChain(parseInt(chainId));
  });

  const subscribe = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);

    let price = "0.1";
    if (currentChain == 97) price = "0.06";
    else if (currentChain == 80001) price = "0.2";

    try {
      const data = await contract.subscribe({
        gasLimit: 300000,
        value: ethers.utils.parseEther(price), //aici va trebui o functie care alege valoarea abonamentului in functie de retea
      });
      setLoading(true);
      provider.once(data.hash, (transaction) => {
        setLoading(false);
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const claim = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    const myAddress = await provider.getSigner().getAddress();

    let bigNumber;
    bigNumber = await contract.getNextClaimDate(myAddress);
    let nextClaimDate = parseInt(bigNumber._hex);

    bigNumber = await contract.getRegistrationDate(myAddress);
    const registrationDate = parseInt(bigNumber._hex);
    const lastClaimDate = registrationDate + 300;

    let totalRewards = 0;
    while (
      nextClaimDate < Math.floor(Date.now() / 1000) &&
      nextClaimDate <= lastClaimDate
    ) {
      totalRewards++;
      nextClaimDate += day;
    }

    try {
      console.log(totalRewards);
      if (totalRewards > 0)
        try {
          await contract.claim(myAddress, totalRewards, nextClaimDate, {});
        } catch (err) {
          await contract.claim(myAddress, totalRewards, nextClaimDate, {
            gasLimit: 400000,
          });
        }
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
