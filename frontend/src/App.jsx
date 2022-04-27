import { ethers } from "ethers";
import { Alert, Button } from "@mui/material";
import { useEffect, useState } from "react";

import "./styles/App.css";
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
    if (currentChain === 97) price = "0.06";
    else if (currentChain === 80001) price = "0.2";

    const data = await contract.subscribe({
      gasLimit: 300000,
      value: ethers.utils.parseEther(price),
    });

    setLoading(true);
    provider.once(data.hash, (transaction) => {
      setLoading(false);
    });
  };

  const claim = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await getContractByProvider(provider);
    const myAddress = await provider.getSigner().getAddress();

    let nextClaimDate = await contract.getNextClaimDate(myAddress);
    nextClaimDate = parseInt(nextClaimDate._hex);

    let registrationDate = await contract.getRegistrationDate(myAddress);
    registrationDate = parseInt(registrationDate._hex);
    const lastClaimDate = registrationDate + 30 * day;

    let totalRewards = 0;
    while (nextClaimDate < Math.floor(Date.now() / 1000) && nextClaimDate <= lastClaimDate) {
      totalRewards++;
      nextClaimDate += day;
    }

    if (totalRewards > 0)
      try {
        const data = await contract.claim(myAddress, totalRewards, nextClaimDate, {});
        setLoading(true);
        provider.once(data.hash, (transaction) => {
          setLoading(false);
        });
      } catch (err) {
        const data = await contract.claim(myAddress, totalRewards, nextClaimDate, {
          gasLimit: 400000,
        });
        setLoading(true);
        provider.once(data.hash, (transaction) => {
          setLoading(false);
        });
      }
    else console.log("0 rewards");
  };

  const pickButtonFunction = (chain, network) => {
    if (currentChain === chain) return () => claim(network);
    else return () => switchNetwork(network);
  };

  if (errorMessage.length > 0) return <Alert severity="error">{errorMessage}</Alert>;

  return (
    <div className="App">
      <div className="container">
        <Button className="subscribeButton" color="success" variant="contained" onClick={() => subscribe()}>
          Subscribe
        </Button>

        <Button variant="contained" onClick={pickButtonFunction(4, "rinkeby")}>
          {currentChain === 4 ? "Claim ETH" : "Switch to rinkeby"}
        </Button>

        <Button variant="contained" onClick={pickButtonFunction(97, "bsc")}>
          {currentChain === 97 ? "Claim BNB" : "Switch to bsc testnet"}
        </Button>

        <Button variant="contained" onClick={pickButtonFunction(80001, "mumbai")}>
          {currentChain === 80001 ? "Claim MATIC" : "Switch to mumbai"}
        </Button>
      </div>
      <LoadingScreen open={loading} />
    </div>
  );
};

export default App;
