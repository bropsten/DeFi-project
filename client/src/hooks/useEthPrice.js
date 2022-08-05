import Web3 from "web3";

import { useEffect, useState } from "react";

export default function useContract(){

  const [priceEth, setPriceEth] = useState(0);

  useEffect(() => {


    const web3 = new Web3("https://rpc.ankr.com/eth_rinkeby");
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const addr = "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF";
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

    priceFeed.methods
      .latestRoundData()
      .call()
      .then((roundData) => {

        let dataPriceEth = roundData.answer / Math.pow(10,8);
        console.log(dataPriceEth);
        setPriceEth(dataPriceEth);
      });


}, [priceEth]);

        return {
            priceEth
        };

}
