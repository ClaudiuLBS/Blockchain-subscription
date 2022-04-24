const { ethers } = require("hardhat");

async function main() {
  const Subscription = await ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(
    ethers.utils.parseEther("0.3"),
    ethers.utils.parseEther("0.003")
  );

  await subscription.deployed();

  console.log("Contract deployed to:", subscription.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
