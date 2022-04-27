const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Subscription", function () {
  it("Should work", async function () {
    const Subscription = await ethers.getContractFactory("Subscription");
    const subscription = await Subscription.deploy(ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.001"));
    await subscription.deployed();
    console.log(process.argv[4]);
  });
});
