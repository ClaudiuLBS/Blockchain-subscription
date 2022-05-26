const { ethers } = require("hardhat");
const fse = require("fs-extra");
const path = require("path");

async function main() {
  const Subscription = await ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(
    ethers.utils.parseEther("0.1"), //0.1 eth, 0.06 bnb, 0.2 matic
    ethers.utils.parseEther("0.002") //0.002 eth, 0.001 bnb, 0.004 matic
  );

  await subscription.deployed();

  const srcDir = path.resolve(__dirname, "../artifacts");
  const destDir = path.resolve(__dirname, "../../frontend/src/artifacts");

  //copy artifacts to frontend/src
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });

 //copy the addresses to the rinkebyAddress.js file from frontend/src/addressses
  const addressDir = path.resolve(__dirname, "../../frontend/src/addresses/rinkebyAddress.js");
  fse.writeFileSync(addressDir, `export default address = '${subscription.address}'`, (err) => console.log(err));
  
  console.log("Rinkeby contract deployed to:", subscription.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
