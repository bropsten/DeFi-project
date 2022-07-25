const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();


module.exports = {
  contracts_build_directory: "../client/src/contracts",
  
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ganache: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: 5777, // Any network (default: none)
    },
    matic: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`}),
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },

  // Set default mocha options here, use special reporters etc.
   mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      gasPrice: 1,
      token: "ETH",
      showTimeSpent: true,
      showTotalGasUsed: true,
      showIndividualGasUsed: true,
      optimizerRuns: 200,
    },
   },

  plugins: [
    "solidity-coverage"
  ],

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
    },
  },
};
