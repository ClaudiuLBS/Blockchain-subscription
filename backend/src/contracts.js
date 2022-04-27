import { getDefaultProvider, Wallet, Contract } from "ethers";
import Subscription from "../../blockchain/artifacts/contracts/Subscription.sol/Subscription.json" assert { type: "json" };
import { privateKey, rinkebyNetwork, bscNetwork, mumbaiNetwork } from "./secrets.js";

const abi = Subscription.abi;

const rinkebyAddress = "0x155a7Dcb2d2929D92D592AC3F2bAFc58b14238eD";
const bscAddress = "0x5bF254bE9E4A67a4b5137B517f44Da427B95Cd47";
const mumbaiAddress = "0x5189A5aA68c77Ff23EBC4597FC7c5F9DB015E667";

const rinkebyProvider = getDefaultProvider(rinkebyNetwork);
const bscProvider = getDefaultProvider(bscNetwork);
const mumbaiProvider = getDefaultProvider(mumbaiNetwork);

const rinkebySigner = new Wallet(privateKey, rinkebyProvider);
const bscSigner = new Wallet(privateKey, bscProvider);
const mumbaiSigner = new Wallet(privateKey, mumbaiProvider);

let rinkebyContract = new Contract(rinkebyAddress, abi, rinkebySigner);
let bscContract = new Contract(bscAddress, abi, bscSigner);
let mumbaiContract = new Contract(mumbaiAddress, abi, mumbaiSigner);

export const rinkeby = rinkebyContract;
export const bsc = bscContract;
export const mumbai = mumbaiContract;
