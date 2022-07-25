// SPDX-License-Identifier: MIT

// Claim : User will be able to stake some token and lock token in the smart contract
// Withdraw : User will be able to unlock token and withdraw tokens
// ClaimReward : User will be able to claim the staking rewards

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity 0.8.14;

error Staking__TransferFailed();


contract Staking {

    // s_ cause it's a stored variable => it's expensive to read and write
    IERC20 public s_stakingToken; 

    //event
    event totalSupply(uint256 _amount);

    // We keep track of how much this user has staked
    mapping(address => uint256) public s_balances;

    // We keep track of the total supply
    uint256 public s_totalSupply ; 

    //contrat addrress
    address Owner;

    constructor(address _stakingToken){
        s_stakingToken = IERC20(_stakingToken);
    }

    // Do we allow any token
    // or specific token 
    // We will need Chainlink to know the exchange price

    function stake(uint256 _amount) external {
        
        // transfer the token to this contract
        // we credit and store in the mapping the staked amount
        s_balances[msg.sender] = s_balances[msg.sender] + _amount ; 
        s_totalSupply  = s_totalSupply + _amount;
        //emit event

        bool success = s_stakingToken.transferFrom(msg.sender, address(this) , _amount);

        // require(succes, "Failed");

        if(!success){
            revert Staking__TransferFailed();
        }
        
    }

    function withdraw(uint256 _amount )external {

        s_balances[msg.sender]=s_balances[msg.sender] - _amount;

        s_totalSupply  = s_totalSupply - _amount;

        bool success = s_stakingToken.transfer( msg.sender , _amount);

        if(!success){
            revert Staking__TransferFailed();
        }
    }

   


}