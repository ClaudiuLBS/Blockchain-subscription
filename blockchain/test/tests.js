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

    // console.log(ethers.utils.parseUnits("0.1", "bnb"));
    await subscription.subscribe({ value: ethers.utils.parseEther("0.1") });
  });
});
