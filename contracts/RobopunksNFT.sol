//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoboPunksNFT is ERC721, ERC721Burnable, Ownable {
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalBurned;
    bool public isPublicMintEnabled;
    string internal baseTokenUri;
    address payable public withdrawWallet;
    address public ownerAddress;
    mapping(address => uint256) public walletMints;
    mapping(uint256 => address) public tokenOwner;
    uint256 public balance;
    bool public paused = false;

    constructor() payable ERC721("RoboPunksNFT", "RP") {
        mintPrice = 0.001 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 10;
        balance = address(this).balance;
        //set withdraw wallet address
        ownerAddress = msg.sender;
    }

    function setIsPublicMintEnabled(
        bool isPublicMintEnabled_
    ) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
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
        balance -= contractBalance;
        require(withdrawWallet.send(contractBalance), "Withdrawal failed");
    }

    function mint(uint256 quantity_) public payable {
        require(isPublicMintEnabled, "minting not enabled");
        require(!paused);
        require(msg.value == quantity_ * mintPrice, "wrong mint value");
        require(totalSupply + quantity_ <= maxSupply, "sold out");
        require(
            walletMints[msg.sender] + quantity_ <= maxPerWallet,
            "exceed max wallet"
        );

        for (uint256 i = 0; i < quantity_; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            tokenOwner[newTokenId] = msg.sender;
            _safeMint(msg.sender, newTokenId);
            walletMints[msg.sender]++;
            balance += msg.value;
        }
    }

    event Burn(uint256 indexed tokenId, address burner);

    function burnNFT(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Only owner can burn a NFT");
        require(_tokenId > 0, "Token ID must be greater than 0");
        emit Burn(_tokenId, msg.sender);
        address nullAddress = address(0);
        tokenOwner[_tokenId] = nullAddress;
    }

    function _removeTokenFromOwnersList(uint256 _tokenId) internal {
        tokenOwner[_tokenId] = address(0);
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setWithdrawWallet(
        address payable newWithdrawWallet
    ) public onlyOwner {
        withdrawWallet = newWithdrawWallet;
    }
}
