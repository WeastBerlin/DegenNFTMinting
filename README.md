# Commands used

npx create-react-app full-mint-website
npm i hardhat
npx hardhat
npm i @openzeppelin/contracts @chakra-ui/react @emotion/react @emotion/styled framer-motion dotenv @nomiclabs/hardhat-etherscan
npx hardhat run scripts/deploy.js --network fuji
npx hardhat verify --network fuji CONTRACTNAME
npm start

# Important

-Fill .env

-Choose, after how many mints the contract pauses
-Choose the "maxSupply", "maxPerWallet" & "mintPrice"

-When adding the baseURI to the function, dont forget to add a "/" at the end of it. For example: "ipfs://bafybeiab6pmlkgcpyicnclnkpe7apat5sq4socuh7ljrh2jqhrrjnejhnu/"

-Delete the SAMPLENAME.json file out of "src" & the folder "artifacts/contracts/SAMPLENAME.sol" before deploying new contract
-Add new contractaddress into "MainMint.js"
-Adjust Mint Price, Total Mints & max Increment in "MainMint.js" if needed
-Copy Paste the new SAMPLENAME.json which was created in "artifacts/contracts/SAMPLENAME.sol/SAMPLENAME.json"

-🔴Enable "isPublicMintEnabled" by writing "true"
-🔴Set a "withdrawWallet" with "setWithdrawWallet"

# Hashlips Important

We have used hashlips to generate our layers
Delete "build" for a new project

# Hardhat Commands

npx hardhat
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run test/test.js
npx hardhat verify --network NETWORKNAME CONTRACTNAME
