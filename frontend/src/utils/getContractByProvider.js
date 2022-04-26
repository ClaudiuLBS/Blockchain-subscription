import { ethers } from "ethers";

import Subscription from "../artifacts/contracts/Subscription.sol/Subscription.json";
import { rinkebyAddress, bscAddress, mumbaiAddress } from "./addresses";

const getContractByProvider = async (provider) => {
  const { chainId } = await provider.getNetwork();
  //alegem adresa contractului in functie de chainId
  let address;
  if (chainId == 4) address = rinkebyAddress;
  else if (chainId == 97) address = bscAddress;
  else if (chainId == 80001) address = mumbaiAddress;

  const contract = new ethers.Contract(
    address,
    Subscription.abi,
    provider.getSigner()
  );

  return contract;
};

export default getContractByProvider;
