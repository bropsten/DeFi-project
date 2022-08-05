import { CheckCircleIcon } from "@heroicons/react/solid";
import React, { useEffect, useState} from "react";
import useWeb3 from "../hooks/useWeb3";
import useEthPrice from "../hooks/useEthPrice";

export default function Staking({contract, account}) {

  const {web3} = useWeb3();
  const [totalSupply, setTotalSupply] = useState(0);
  const [userStakingReward, setUserStakingReward] = useState(0);
  const [broTokenAddress, setBroTokenAddress] = useState('');
  const [userStakedBalance, setUserStakedBalance] = useState(0);
  const [userLockedBalance, setuserLockedBalance] = useState(0);
  const [userBROTokenBalance, setuserBROTokenBalance] = useState(0);
  const [lockedDeadline, setLockedDeadline] = useState(0);
  const [rewardPerTokenStored, setrewardPerTokenStored] = useState(0);
  const [stakingContract, setStakingContract] = useState(0);

  const {priceEth} = useEthPrice();




  const projects = [
    { name: 'Your token amount staked', initials: 'TaS', amount: userStakedBalance, bgColor: 'bg-pink-600', token: 'BROtoken', dollarsPrice : userStakedBalance * priceEth + " $"},
    { name:"Your locked tokens amount staked" , initials: 'LaS', amount:userLockedBalance , bgColor: 'bg-purple-600' , token: 'BROtoken' , dollarsPrice : userLockedBalance * priceEth + " $"},
    { name: "Your tokens will be unlock the", initials: 'WbU', amount:lockedDeadline , bgColor: 'bg-yellow-500'},
    { name: "Your BROToken Wallet Balance", initials: 'WbU', amount:userBROTokenBalance , bgColor: 'bg-red-500', token: 'BROtoken', dollarsPrice : userBROTokenBalance * priceEth + " $"},
    { name: "Total supply :" , initials: 'TS', amount: totalSupply, bgColor: 'bg-blue-500', token: 'BROtoken', dollarsPrice : totalSupply * priceEth + " $"},
    { name: "Your staking reward :" , initials: 'YsR', amount: userStakingReward, bgColor: 'bg-green-500', token: 'BROtoken', dollarsPrice : userStakingReward * priceEth + " $" },
    { name: "Reward per token stored :" , initials: 'RpT', amount: rewardPerTokenStored, bgColor: 'bg-red-500', token: 'BROtoken', dollarsPrice : rewardPerTokenStored * priceEth + " $"},
  ]


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  useEffect(() => {
    if( ! contract ){
      return;
    }

    contract.staking.events.Stake({ fromBlock: "latest" }) 
    .on('data', event => {
      getRewardPerTokenStored();
      getUserRewardBalance();
      getTotalSupply();
    });

    contract.staking.events.WithdrawStake({ fromBlock: "latest" }) 
    .on('data', event => {
      getRewardPerTokenStored();
      getUserRewardBalance();
      getTotalSupply();
    });

    setStakingContract(contract.staking._address);
    setBroTokenAddress(contract.BROToken._address);
    updateInfos();
  }, [contract, account]);
  
  function updateInfos() {
    getUserStakedBalance();
    getUserLockedStakedBalance();
    getUserRewardBalance();
    getUnlockDeadline();
    getUserBROTokenBalance();
    getRewardPerTokenStored();
    getTotalSupply();
  }

  async function getUserStakedBalance() {
    const stakedBalance = await contract.staking.methods.balances(account).call({ from: account });
    console.log("staked balance (wei)", stakedBalance);
    setUserStakedBalance(convertFromWei(stakedBalance));
  }

  async function getUserLockedStakedBalance() {
    const lockedBalance = await contract.staking.methods.lockedBalances(account).call({ from: account });
    console.log("locked balance (wei)", lockedBalance.balance);
    setuserLockedBalance(convertFromWei(lockedBalance.balance));
  }

  async function getUserBROTokenBalance() {
    const BROBalance = await contract.BROToken.methods.balanceOf(account).call({ from: account });
    console.log("reward balance (wei)", BROBalance);
    setuserBROTokenBalance(convertFromWei(BROBalance));
  }

  async function getRewardPerTokenStored() {
    const rewardPerToken = await contract.staking.methods.rewardPerTokenStored().call({ from: account });
    console.log("reward per token stored", rewardPerToken);
    setrewardPerTokenStored(convertFromWei(rewardPerToken));
  }

  async function getUnlockDeadline() {
    const lockedBalance = await contract.staking.methods.lockedBalances(account).call({ from: account });
    console.log("locked deadline (timestamp)", lockedBalance.deadline);
    
    if (lockedBalance.deadline === "0") {
      setLockedDeadline("");
    } else {
      const dateObject = new Date(lockedBalance.deadline * 1000);
      const date = dateObject.toLocaleString();
      setLockedDeadline(date);
    }
  }

  async function getTotalSupply() {
    let totalSupply = await contract.staking.methods.totalSupply().call({ from: account });
    console.log("totalSupply (wei)", totalSupply);
    setTotalSupply(convertFromWei(totalSupply));
  }

  async function getUserRewardBalance() {
    const stakingRewardBalance = await contract.staking.methods.rewardsBalance(account).call({ from: account });
    console.log("staking reward balance (wei)", stakingRewardBalance);
    setUserStakingReward(convertFromWei(stakingRewardBalance));
  }
  
  function convertFromWei(value) {
    return web3.utils.fromWei(value, "ether");
  }

  function convertToWei(value) {
    return web3.utils.toWei(value, "ether");
  }

  function getInput(id) {
    const element = document.getElementById(id);
    const value = element.value;
    element.value = "";
    return value;
  }

  async function addStaking() {
    const value = getInput("stake");

    if (value !== "") {
      const amountToStake = convertToWei(value);
      const checkBox = document.getElementById("lockedTime");
      const checkBoxTickOrNot = checkBox.checked;
      
      try {
        await contract.BROToken.methods.approve(contract.staking._address, amountToStake).send({ from: account });
        await contract.staking.methods.stake(amountToStake, checkBoxTickOrNot).send({ from: account });
        updateInfos();
      } catch (err) {
        console.error("stake amount", err);
      }
    }
  }

  async function withdraw() {
    const value = getInput("withdraw");
    
    if (value !== "") {
      const amountToWithdraw = convertToWei(value);
      
      try {
        await contract.staking.methods.withdraw(amountToWithdraw).send({ from: account });
        updateInfos();
      } catch (err) {
        console.error("withdraw amount", err);
      }
    }
  }

  async function withdrawLocked() {
    try {
      await contract.staking.methods.withdrawLocked().send({ from: account });
      updateInfos();
    } catch (err) {
      console.error("withdraw amount", err);
    }
  }

  async function mint() {
    try {
      await contract.BROToken.methods.faucet(account).send({ from: account });
      updateInfos();
    } catch (err) {
      console.error("mint", err);
    }
  }

  async function claimReward() {
    try {
      await contract.staking.methods.claimReward().send({ from: account });
      updateInfos();
    } catch (err) {
      console.error("mint", err);
    }
  }

  async function compound() {
    try {
      const transaction = await contract.staking.methods.claimReward().send({ from: account });
      const rewards = transaction.events.RewardsClaimed.returnValues.amount;
      await contract.BROToken.methods.approve(contract.staking._address, rewards).send({ from: account });
      await contract.staking.methods.stake(rewards, false).send({ from: account });
      updateInfos();
    } catch (err) {
      console.log("compound", err)
    }
  }

  return (
    <>

      <div className="max-w-7xl mb-10 ">
        <h1 className="text-2xl font-semibold text-gray-900">
          Staking Dashboard
        </h1>
        <p className="mt-5">BROToken contract address :<span className="font-bold"> {broTokenAddress} </span></p>
        <p className="mt-5"><a href={`https://ropsten.etherscan.io/address/${stakingContract}`} target="blank"><span className="text-blue-600 font-semibold">The contract staking address is : </span></a><span className="font-bold">{stakingContract}</span> </p> 
        <p className="mt-5">The DAI / USD pair (from Chainlink) : <span className="font-bold">{priceEth} $</span></p>
        <p className="mt-5">One BRO Token equal (from Chainlink) : <span className="font-bold">{priceEth/2} </span></p> 
        
      </div>


      <div className="max-w-4xl">
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <li key={project.name} className="col-span-1 flex shadow-sm rounded-md">
              <div
                className={classNames(
                  project.bgColor,
                  'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                )}
              >
                {project.initials}
              </div>
              <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                <div className="flex-1 px-4 py-2 text-md truncate">
                  
                    {project.name}
                
                  <p className="mt-2 text-black-500 font-semibold">{project.amount} <span className="font-normal text-blue-500">{project.token}</span></p>
                  <p>{project.dollarsPrice} </p>
                </div>  
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-2xl">

      <div className="rounded-md bg-green-50 p-4 my-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Claim reward</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>You can claim your reward if you have some </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={claimReward}
                    className="mr-5 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Claim my reward
                  </button>
                  <button
                    type="button"
                    onClick={compound}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Compound my reward
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white shadow sm:rounded-lg mt-10">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              FAUCET BroToken please mint some token
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                By clicking this button you will receive 1000 BRO Tokens
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={mint}
                type="submit"
                id="mint"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Mint
              </button>
            </div>
    
          </div>
        </div>


        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Select the amount you want to stake
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="stake" className="sr-only">
                  Stake
                </label>
                <input
                  type="text"
                  name="stake"
                  id="stake"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  aria-describedby="price-currency"
                />
              </div>
              <button
                type="submit"
                onClick={addStaking}
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                STAKE
              </button>
            </div>

            <fieldset className="space-y-5">
              <legend className="sr-only">Notifications</legend>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="lockedTime"
                    aria-describedby="comments-description"
                    name="lockedTime"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="comments" className="font-medium text-gray-700">
                    Locking time
                  </label>
                  <p id="comments-description" className="text-gray-500">
                    If you tick the case, you will lock your token for one month<br></br>your APY will be x1000000 so that's great
                  </p>
                </div>
              </div>
            </fieldset>

          </div>
        </div>

      <div className="bg-white shadow sm:rounded-lg mt-10">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Select the amount you want to withdraw
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
           
          </div>
          <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
              <label htmlFor="withdraw" className="sr-only">
                Withdraw
              </label>
              <input
                type="text"
                name="withdraw"
                id="withdraw"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                aria-describedby="price-currency"
              />
            </div>
            <button
              type="submit"
              onClick={withdraw}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              WITHDRAW
            </button>
          </div>
            

        </div>
      </div>
        <div className="bg-white shadow sm:rounded-lg mt-10">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Please withdraw when the countdown is over
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
             
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="withdraw" className="sr-only">
                  Withdraw locked
                </label>
              </div>
              <button
                type="submit"
                onClick={withdrawLocked}
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                WITHDRAW LOCKED
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}