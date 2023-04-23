const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("CyberDegensNFT", () => {
  let CyberDegensNFT;
  let cyberDegensNFT;

  beforeEach(async () => {
    CyberDegensNFT = await ethers.getContractFactory("CyberDegensNFT");
    cyberDegensNFT = await CyberDegensNFT.deploy();
    await cyberDegensNFT.deployed();
  });

  it("should deploy the contract and set initial values", async () => {
    const name = await cyberDegensNFT.name();
    const symbol = await cyberDegensNFT.symbol();
    const mintPrice = await cyberDegensNFT.mintPrice();
    const maxSupply = await cyberDegensNFT.maxSupply();

    expect(name).to.equal("Cyber Degens");
    expect(symbol).to.equal("CD");
    expect(mintPrice).to.equal(0);
    expect(maxSupply).to.equal(1111);
  });

  it("should allow the owner to set a new mint price", async () => {
    await cyberDegensNFT.setMintPrice(10);
    const mintPrice = await cyberDegensNFT.mintPrice();

    expect(mintPrice).to.equal(10);
  });

  it("should allow the owner to set a new mint stop value", async () => {
    await cyberDegensNFT.setMintStopValue(200);
    const mintStopValue = await cyberDegensNFT.mintStopValue();

    expect(mintStopValue).to.equal(200);
  });

  it("should allow the owner to pause and unpause the contract", async () => {
    await cyberDegensNFT.pause(true);
    const isPaused = await cyberDegensNFT.paused();

    expect(isPaused).to.equal(true);

    await cyberDegensNFT.pause(false);
    const isUnpaused = await cyberDegensNFT.paused();

    expect(isUnpaused).to.equal(false);
  });

  it("should allow the owner to set a new max per wallet", async () => {
    await cyberDegensNFT.setMaxPerWallet(5);
    const maxPerWallet = await cyberDegensNFT.maxPerWallet();

    expect(maxPerWallet).to.equal(5);
  });

  it("should allow the owner to set the base token URI", async () => {
    const baseTokenUri = "https://example.com/api/token/";
    await cyberDegensNFT.setBaseTokenUri(baseTokenUri);
    const newBaseTokenUri = await cyberDegensNFT.baseTokenUri();

    expect(newBaseTokenUri).to.equal(baseTokenUri);
  });

  it("should mint tokens correctly", async () => {
    await cyberDegensNFT.setMintPrice(0); // Make sure the mint price is 0 for testing

    const [owner, addr1] = await ethers.getSigners();

    // Mint 1 token for addr1
    await cyberDegensNFT.connect(addr1).mint(1);

    // Check the total supply and token ownership
    const totalSupply = await cyberDegensNFT.totalSupply();
    const ownerOfToken = await cyberDegensNFT.ownerOf(1);

    expect(totalSupply).to.equal(1);
    expect(ownerOfToken).to.equal(addr1.address);
  });

  it("should allow the owner to add and remove addresses from the whitelist", async () => {
    const [_, addr1, addr2] = await ethers.getSigners();

    // Add addr1 and addr2 to the whitelist
    await cyberDegensNFT.addToWhitelist([addr1.address, addr2.address]);

    // Check if they are in the whitelist
    const isAddr1Whitelisted = await cyberDegensNFT.whitelist(addr1.address);
    const isAddr2Whitelisted = await cyberDegensNFT.whitelist(addr2.address);

    expect(isAddr1Whitelisted).to.equal(true);
    expect(isAddr2Whitelisted).to.equal(true);

    // Remove addr1 and addr2 from the whitelist
    await cyberDegensNFT.removeFromWhitelist([addr1.address, addr2.address]);

    // Check if they are removed from the whitelist
    const isAddr1Removed = await cyberDegensNFT.whitelist(addr1.address);
    const isAddr2Removed = await cyberDegensNFT.whitelist(addr2.address);

    expect(isAddr1Removed).to.equal(false);
    expect(isAddr2Removed).to.equal(false);
  });

  it("should allow the owner to enable and disable the whitelist", async () => {
    await cyberDegensNFT.setIsWhitelistEnabled(true);
    const isWhitelistEnabled = await cyberDegensNFT.isWhitelistEnabled();

    expect(isWhitelistEnabled).to.equal(true);

    await cyberDegensNFT.setIsWhitelistEnabled(false);
    const isWhitelistDisabled = await cyberDegensNFT.isWhitelistEnabled();

    expect(isWhitelistDisabled).to.equal(false);
  });

  it("should allow token owner to burn their token", async () => {
    await cyberDegensNFT.setMintPrice(0); // Make sure the mint price is 0 for testing

    const [_, addr1] = await ethers.getSigners();

    // Mint 1 token for addr1
    await cyberDegensNFT.connect(addr1).mint(1);

    // Burn the token
    await cyberDegensNFT.connect(addr1).burn(1);

    // Check the total supply and total burned
    const totalSupply = await cyberDegensNFT.totalSupply();
    const totalBurned = await cyberDegensNFT.totalBurned();

    expect(totalSupply).to.equal(0);
    expect(totalBurned).to.equal(1);

    // Check if the token no longer exists
    await expect(cyberDegensNFT.ownerOf(1)).to.be.revertedWith(
      "ERC721: invalid token ID"
    );
  });

  it("should not allow non-owners to burn tokens", async () => {
    await cyberDegensNFT.setMintPrice(0); // Make sure the mint price is 0 for testing

    const [_, addr1, addr2] = await ethers.getSigners();

    // Mint 1 token for addr1
    await cyberDegensNFT.connect(addr1).mint(1);

    // Attempt to burn the token with addr2 (non-owner)
    await expect(cyberDegensNFT.connect(addr2).burn(1)).to.be.revertedWith(
      "ERC721: caller is not token owner or approved"
    );
  });

  it("should update token URI correctly", async () => {
    const baseTokenUri = "https://example.com/api/token/";
    await cyberDegensNFT.setBaseTokenUri(baseTokenUri);
    await cyberDegensNFT.setMintPrice(0); // Make sure the mint price is 0 for testing

    const [_, addr1] = await ethers.getSigners();

    // Mint 1 token for addr1
    await cyberDegensNFT.connect(addr1).mint(1);

    const tokenURI = await cyberDegensNFT.tokenURI(1);
    const expectedTokenURI = baseTokenUri + "1.json";

    expect(tokenURI).to.equal(expectedTokenURI);
  });

  it("should update the contract balance correctly after minting", async () => {
    await cyberDegensNFT.setMintPrice(ethers.utils.parseEther("0.01")); // Set mint price to 0.01 ETH for testing

    const [owner, addr1] = await ethers.getSigners();

    // Mint 1 token for addr1
    await cyberDegensNFT
      .connect(addr1)
      .mint(1, { value: ethers.utils.parseEther("0.01") });

    // Check the contract balance
    const contractBalance = await ethers.provider.getBalance(
      cyberDegensNFT.address
    );
    expect(contractBalance).to.equal(ethers.utils.parseEther("0.01"));
  });
});
