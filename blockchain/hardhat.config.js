require("@nomiclabs/hardhat-waffle");
require("dotenv").config()


module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};
