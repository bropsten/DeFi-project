const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();

const mnemonic = process.env.MNEMONIC;
const infuraProjectId = process.env.INFURA_PROJECT_ID;


module.exports = {
  contracts_build_directory: "../client/src/contracts",

  networks: {
   
    development: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*",      
    },
    ganache: {
      host: "127.0.0.1", 
      port: 7545, 
      network_id: 5777, 
    },
    ropsten: {
      provider : function() {
        return new HDWalletProvider({
          mnemonic:{ phrase: mnemonic },
          providerOrUrl:`https://ropsten.infura.io/v3/${infuraProjectId}`,
          addressIndex: 0,
        })
      },
      network_id:3,
    },
    kovan: {
      provider : function() {
        return new HDWalletProvider({
          mnemonic:{ phrase: mnemonic },
          providerOrUrl:`https://kovan.infura.io/v3/${infuraProjectId}`,
          addressIndex: 0,
        })
      },
      network_id: 42,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    rinkeby: {
      provider : function() {
        return new HDWalletProvider({
          mnemonic:{ phrase: mnemonic },
          providerOrUrl:`https://rinkeby.infura.io/v3/${infuraProjectId}`,
          addressIndex: 0,
        })
      },
      network_id: 4,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
    
  },


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
    }
  },

 
};