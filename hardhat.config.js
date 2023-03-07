require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.1",
  networks: {
    goerli: {
      url: process.env.REACT_APP_GOERLI_RPC_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    },
    fuji: {
      url: process.env.REACT_APP_FUJI_RPC_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    },
    avalanche: {
      url: process.env.REACT_APP_AVALANCHE_RPC_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.REACT_APP_ETHERSCAN_KEY,
      avalancheFujiTestnet: process.env.REACT_APP_SNOWTRACE_KEY,
      avalanche: process.env.REACT_APP_SNOWTRACE_KEY,
    },
  },
};
