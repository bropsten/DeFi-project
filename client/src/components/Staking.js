import { CheckCircleIcon } from "@heroicons/react/solid";
import BigNumber from "bignumber.js"
import React, { useEffect, useState} from "react";
import useWeb3 from "../hooks/useWeb3";

export default function Staking({contract, account}) {

  const{web3} = useWeb3();
  const [contractBalance, setContractBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [userTokenStaked, setUserTokenStaked] = useState(0);
  const [userStakingReward, setUserStakingReward] = useState(0);
  const [broTokenAddress, setBroTokenAddress] = useState('');

  useEffect(() => {
    if( ! contract ){
      return;
    }

    setBroTokenAddress(contract.BROToken._address);

    async function getUserTokenStaked() {
      let userTokenStaked = await contract.staking.methods.balances(account).call();
      console.log(userTokenStaked);
      userTokenStaked = web3.utils.fromWei(userTokenStaked, 'ether');
      
      // we get all event
      const pastTokenStake = await contract.staking.getPastEvents('Stake', { fromBlock: 0, toBlock: 'latest' });
      console.log(pastTokenStake);

      // we get all the ammount staked by the user
      const pastTokenStakeBalance = pastTokenStake.map(event => {
        return event.returnValues.amount;
      });
      console.log(pastTokenStakeBalance);

      let totalBalanceUserStaked = 0;

      pastTokenStakeBalance.forEach((value, i) => {
        totalBalanceUserStaked += parseFloat(value);
        
      });

      totalBalanceUserStaked = new BigNumber(totalBalanceUserStaked).toFixed(0);
      totalBalanceUserStaked = web3.utils.fromWei(totalBalanceUserStaked, 'ether');
      setUserTokenStaked(totalBalanceUserStaked);

    }

    async function getYourOwnBalance() {
      let balance = await contract.BROToken.methods.balanceOf(account).call();
      balance =  web3.utils.fromWei(balance, 'ether');
      console.log(balance);
      setContractBalance(balance);
    }

    async function getTotalSupply() {
      let totalSupply = await contract.staking.methods.totalSupply().call();
      totalSupply = web3.utils.fromWei(totalSupply, 'ether');
      console.log(totalSupply);
      setTotalSupply(totalSupply);
    }


    async function getUserStakingReward() {
      let userStakingReward = await contract.staking.methods.rewardsBalance(account).call();
      userStakingReward = web3.utils.fromWei(userStakingReward, 'ether');
      console.log(userStakingReward);
      setUserStakingReward(userStakingReward);
    }

    getUserStakingReward();
    getUserTokenStaked();
    getTotalSupply()
    getYourOwnBalance()
}, [contract, account]);


  async function addStaking(){
    const element = document.getElementById("stake");
    const amountToStake = element.value;
    let transactionAddStaking;

    const checkBox = document.getElementById("lockedTime");
    const checkBoxTickOrNot = checkBox.checked.toString();
    console.log(checkBoxTickOrNot);

    try {
      let approve = await contract.BROToken.methods.approve(contract.staking._address, amountToStake).send({ from: account });
      console.log(approve)
      transactionAddStaking = await contract.staking.methods.stake(amountToStake, checkBoxTickOrNot).send({from: account});
      console.log(transactionAddStaking);
      
    }catch(err){
      console.log(err);
    }

    element.value = "";
  }

  async function mint() {
    try {
      let transaction = await contract.BROToken.methods.faucet(account).send({from: account});
      console.log(transaction);
    }catch(err){
      console.log(err);
    }
  }

  

  return (
    <>
      <div className="max-w-7xl mx-auto mb-10 ">
        <h1 className="text-2xl font-semibold text-gray-900">
          Staking Dashboard
        </h1>
        <p>Token BRO contract adress {broTokenAddress} </p>

        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div>
            <ul className="mt-1 max-w-2xl text-blue-sm text-gray-500">
              <li>Your token amount staked : {userTokenStaked}</li>
              <li>Your BROtoken wallet balance : {contractBalance} </li>
              <li>Total supply : {totalSupply}</li>
              <li>Your staking reward : {userStakingReward} </li>
              
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg mt-10">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Please mint some token
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
              <p>You have 100$ ready to claim</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  Claim my reward
                </button>
                <button
                  type="button"
                  className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  Compound my reward
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Select the amount you want to stake
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Change the email address you want associated with your account.
            </p>
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
            <p>
              Change the email address you want associated with your account.
            </p>
          </div>
          <form className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="stake" className="sr-only">
                Stake
              </label>
              <input
                type="text"
                name="price"
                id="price"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                aria-describedby="price-currency"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              WITHDRAW
            </button>
          </form>
        </div>
      </div>
      
    </>
  );
}
