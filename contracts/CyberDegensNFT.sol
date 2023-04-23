//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CyberDegensNFT is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalBurned;
    uint256 public balance;
    uint256 public mintStopValue;
    bool public isPublicMintEnabled;
    bool public paused = false;
    bool public isWhitelistEnabled = false;
    string public baseTokenUri;
    address payable public withdrawWallet;
    address public ownerAddress;
    mapping(address => uint256) public walletMints;
    mapping(address => bool) public whitelist;

    constructor() payable ERC721("Cyber Degens", "CD") {
        mintPrice = 0 ether;
        totalSupply = 0;
        maxSupply = 1111;
        maxPerWallet = 1;
        mintStopValue = 111;
        balance = address(this).balance;
        ownerAddress = msg.sender;
    }

    function setIsPublicMintEnabled(
        bool isPublicMintEnabled_
    ) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    function setMaxPerWallet(uint newMaxPerWallet) public onlyOwner {
        maxPerWallet = newMaxPerWallet;
    }

    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri = baseTokenUri_;
    }

    function tokenURI(
        uint256 tokenId_
    ) public view override returns (string memory) {
        require(_exists(tokenId_), "Token does not exist!");
        return
            string(
                abi.encodePacked(
                    baseTokenUri,
                    Strings.toString(tokenId_),
                    ".json"
                )
            );
    }

    function withdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Contract balance is 0");
        balance -= contractBalance;
        require(withdrawWallet.send(contractBalance), "Withdrawal failed");
    }

    function mint(uint256 quantity_) public payable {
        require(!paused);
        require(msg.value == quantity_ * mintPrice, "wrong mint value");
        require(totalSupply + quantity_ <= maxSupply, "sold out");
        require(
            walletMints[msg.sender] + quantity_ <= maxPerWallet,
            "exceed max wallet"
        );

        if (isWhitelistEnabled) {
            require(whitelist[msg.sender], "not whitelisted");
        }

        for (uint256 i = 0; i < quantity_; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
            walletMints[msg.sender]++;
            balance += msg.value;

            if (totalSupply == mintStopValue) {
                isPublicMintEnabled = false;
            }
        }
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setWithdrawWallet(
        address payable newWithdrawWallet
    ) public onlyOwner {
        withdrawWallet = newWithdrawWallet;
    }

    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    function addToWhitelist(address[] memory addresses_) public onlyOwner {
        for (uint256 i = 0; i < addresses_.length; i++) {
            whitelist[addresses_[i]] = true;
        }
    }

    function removeFromWhitelist(address[] memory addresses_) public onlyOwner {
        for (uint256 i = 0; i < addresses_.length; i++) {
            whitelist[addresses_[i]] = false;
        }
    }

    function setIsWhitelistEnabled(
        bool isWhitelistEnabled_
    ) external onlyOwner {
        isWhitelistEnabled = isWhitelistEnabled_;
    }

    function setMintStopValue(uint256 newMintStopValue) public onlyOwner {
        mintStopValue = newMintStopValue;
    }

    function burn(uint256 tokenId) public virtual override {
        super.burn(tokenId);
        totalBurned++;
    }
}
