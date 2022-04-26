const { expect } = require("chai");
const { ethers } = require("hardhat");

async function wait(days) {
  await network.provider.send("evm_increaseTime", [86400 * days]);
  await network.provider.send("evm_mine");
}

describe("Subscription", function () {
  it("Should work", async function () {
    const Subscription = await ethers.getContractFactory("Subscription");
    const subscription = await Subscription.deploy(
      ethers.utils.parseEther("0.1"),
      ethers.utils.parseEther("0.001")
    );
    await subscription.deployed();

    // const rinkebyProvider = ethers.getDefaultProvider(
    //   "https://rinkeby.infura.io/v3/9b002978561d42a0a220ddca7f38893b"
    // );
    // const bscProvider = ethers.getDefaultProvider(
    //   "https://data-seed-prebsc-1-s1.binance.org:8545"
    // );
    // const mumbaiProvider = ethers.getDefaultProvider(
    //   "https://polygon-mumbai.g.alchemy.com/v2/OCfh91vbINd8BDWsl7BWtKXtds2hqmTV"
    // );

    // rinkebyProvider;
    // console.log(ethers.utils.parseUnits("0.1", "bnb"));
    await subscription.subscribe({ value: ethers.utils.parseEther("0.1") });
  });
});
