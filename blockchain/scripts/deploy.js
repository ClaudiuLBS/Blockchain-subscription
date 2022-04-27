const { ethers } = require("hardhat");

async function main() {
  const Subscription = await ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(
    ethers.utils.parseEther("0.2"), //0.1 eth, 0.06 bnb, 0.2 matic
    ethers.utils.parseEther("0.004") //0.002 eth, 0.001 bnb, 0.004 matic
  );

  await subscription.deployed();

  const fse = require("fs-extra");
  const srcDir = `C:/Users/Claudiu/Desktop/Blockchain_Project/Lecture3/Task3/blockchain/artifacts`;
  const destDir = `C:/Users/Claudiu/Desktop/Blockchain_Project/Lecture3/Task3/frontend/src/artifacts`;

  //copy artifacts to frontend/src
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });

  //copy the address to the address.js file from frontend/src

  console.log("Contract deployed to:", subscription.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
