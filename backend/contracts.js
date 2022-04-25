const ethers = require("ethers");
const Subscription = require("../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");

const privateKey =
  "43fea9dcf0621bb5a5d28065d4b9d5a0a2620a994b5c465ca4d59c1287c6f0dd";

const rinkebyAddress = "0xff77E544e53a201d5d435c8D43Dc8b475f2f2c8C";
const bscAddress = "0x04A933bD6843B87494818267CbfaB03402996a60";
const mumbaiAddress = "0xD2fE0f730f3036bE700bC4fF738F92F3e4386f9B";

const rinkebyProvider = ethers.getDefaultProvider(
  "https://rinkeby.infura.io/v3/9b002978561d42a0a220ddca7f38893b"
);
const bscProvider = ethers.getDefaultProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);
const mumbaiProvider = ethers.getDefaultProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/OCfh91vbINd8BDWsl7BWtKXtds2hqmTV"
);

const rinkebySigner = new ethers.Wallet(privateKey, rinkebyProvider);
const bscSigner = new ethers.Wallet(privateKey, bscProvider);
const mumbaiSigner = new ethers.Wallet(privateKey, mumbaiProvider);

let rinkebyContract = new ethers.Contract(
  rinkebyAddress,
  Subscription.abi,
  rinkebySigner
);

let bscContract = new ethers.Contract(bscAddress, Subscription.abi, bscSigner);

let mumbaiContract = new ethers.Contract(
  mumbaiAddress,
  Subscription.abi,
  mumbaiSigner
);

module.exports = {
  rinkeby: rinkebyContract,
  bsc: bscContract,
  mumbai: mumbaiContract,
};
