import { ethers } from "ethers";

import Subscription from "../artifacts/contracts/Subscription.sol/Subscription.json";
import rinkebyAddress from "../addresses/rinkebyAddress";
import bscAddress from "../addresses/bscAddress";
import mumbaiAddress from "../addresses/mumbaiAddress";



const getContractByProvider = async (provider) => {
  const { chainId } = await provider.getNetwork();
  let address;

  if (chainId === 4) address = rinkebyAddress;
  else if (chainId === 97) address = bscAddress;
  else if (chainId === 80001) address = mumbaiAddress;

  const contract = new ethers.Contract(address, Subscription.abi, provider.getSigner());
  return contract;
};

export default getContractByProvider;
