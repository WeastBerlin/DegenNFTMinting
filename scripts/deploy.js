const hre = require("hardhat");

async function main() {
  const CyberDegensNFT = await hre.ethers.getContractFactory("CyberDegensNFT");
  const cyberDegensNFT = await CyberDegensNFT.deploy(); //Empty because our constructor is empty

  await cyberDegensNFT.deployed();

  console.log("CyberDegensNFT deployed to:", cyberDegensNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
