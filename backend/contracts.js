const ethers = require("ethers");
const Subscription = require("../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");

const privateKey =
  "43fea9dcf0621bb5a5d28065d4b9d5a0a2620a994b5c465ca4d59c1287c6f0dd";

const rinkebyAddress = "0x537A759eB439628B661bAB979bCDc6180F4E3Eb1";
const bscAddress = "0x24EC8CF23990eD1C2AC2c4DcbeEf1b19508d50Dc";
const mumbaiAddress = "0x038dFD2b50c0e3B1d99c6A128C8eAABFA95045Dd";

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
