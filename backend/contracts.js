const ethers = require("ethers");
const Subscription = require("../blockchain/artifacts/contracts/Subscription.sol/Subscription.json");

const privateKey =
  "43fea9dcf0621bb5a5d28065d4b9d5a0a2620a994b5c465ca4d59c1287c6f0dd";

const rinkebyAddress = "0x5AF4271d4b90BDe8760751241Ea3e0b3FA581567";
const bscAddress = "0x827eb526d134FD769079A95046cB22F397c6867e";
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
