//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyberDegensNFT is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalBurned;
    bool public isPublicMintEnabled;
    string public baseTokenUri;
    address payable public withdrawWallet;
    address public ownerAddress;
    mapping(address => uint256) public walletMints;
    mapping(uint256 => address) public _owner;
    mapping(address => mapping(uint256 => uint256)) private tokenIndex;
    mapping(address => uint256[]) private _ownerTokens;
    uint256 public balance;
    bool public paused = false;
    mapping(address => bool) public whitelist;
    bool public isWhitelistEnabled = false;

    constructor() payable ERC721("Cyber Degens", "CD") {
        //set the minting price MUST MATCH WITH FRONTEND PRICE OR THRWOS AN ERROR
        mintPrice = 0.001 ether;
        //must start with 0
        totalSupply = 0;
        //maximum of NFTs minted
        maxSupply = 3333;
        //maximum of NFTs allowed to mint per wallet
        maxPerWallet = 3333;
        //balance shown in block explorer
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

    function _safeMint(address to, uint256 tokenId) internal virtual override {
        super._safeMint(to, tokenId);
        tokenIndex[to][tokenId] = balanceOf(to) - 1;
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
            _owner[newTokenId] = msg.sender;
            _safeMint(msg.sender, newTokenId);
            walletMints[msg.sender]++;
            balance += msg.value;

            if (totalSupply == 100) {
                isPublicMintEnabled = false;
            }
        }
    }

    event Burn(uint256 indexed tokenId, address burner);

    function burnNFT(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Only owner can burn a NFT");
        require(_tokenId > 0, "Token ID must be greater than 0");
        emit Burn(_tokenId, msg.sender);
        address nullAddress = address(0);
        _removeTokenFromOwnersList(_tokenId);
        _owner[_tokenId] = nullAddress;
        totalBurned++;
        totalSupply--;
    }

    function _removeTokenFromOwnersList(uint256 _tokenId) internal {
        address owner = _owner[_tokenId];
        uint256 index = tokenIndex[owner][_tokenId];

        // Get the ID of the last token in the owner's list
        uint256 lastTokenId = _ownerTokens[owner][
            _ownerTokens[owner].length - 1
        ];

        // Update the owner's list to remove the token
        _ownerTokens[owner][index] = lastTokenId;
        _ownerTokens[owner].pop();

        // Update the token's index in the owner's list
        if (_ownerTokens[owner].length > 0) {
            uint256 newLastTokenId = _ownerTokens[owner][
                _ownerTokens[owner].length - 1
            ];
            tokenIndex[owner][newLastTokenId] = index;
        }
        tokenIndex[owner][_tokenId] = 0;
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

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        if (from != address(0)) {
            uint256[] storage fromTokens = _ownerTokens[from];
            for (uint256 i = 0; i < fromTokens.length; i++) {
                if (fromTokens[i] == tokenId) {
                    fromTokens[i] = fromTokens[fromTokens.length - 1];
                    fromTokens.pop();
                    break;
                }
            }
        }
        if (to != address(0)) {
            _ownerTokens[to].push(tokenId);
        }
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
}
