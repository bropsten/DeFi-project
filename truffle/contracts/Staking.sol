// SPDX-License-Identifier: MIT

// Claim : User will be able to stake some token and lock token in the smart contract
// Withdraw : User will be able to unlock token and withdraw tokens
// ClaimReward : User will be able to claim the staking rewards

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity 0.8.14;

error Staking__TransferFailed();
error Staking__NeedsMoreThanZero();


contract Staking {

    // s_ cause it's a stored variable => it's expensive to read and write
    IERC20 public s_stakingToken; 

    IERC20 public s_rewardToken; 

    // someone address -> how much they staked
    mapping(address => uint256) public s_balances;

   // a mapping of how much rewards each address has to claim
    mapping(address => uint256) public s_rewards;

    // a mapping of how much each address has been paid
    mapping(address => uint256) public s_userRewardPerTokenPaid;



    // We keep track of the total supply

    uint256 public constant REWARD_RATE = 100;
    uint256 public s_totalSupply ; 
    uint256 public s_rewardPerTokenStored;
    uint256 public s_lastUpdateTime;

    modifier updateReward(address _account) {
        //how much reward per token
        // last timestamp
        s_rewardPerTokenStored  = rewardPerToken();
        s_lastUpdateTime = block.timestamp;
        s_rewards[_account] = earned(_account);
        s_userRewardPerTokenPaid[_account] = s_rewardPerTokenStored;

        _;
    }

    modifier moreThanZero(uint256 _amount){
        if (_amount == 0){
            revert Staking__NeedsMoreThanZero();
        }
        _;
    }


    constructor(address _stakingToken, address _rewardToken){
        s_stakingToken = IERC20(_stakingToken);
        s_rewardToken = IERC20(_rewardToken);
    }

    function earned(address _account) public view returns (uint256){
        uint256 currentBalance = s_balances[_account];
        uint256 amountPaid = s_userRewardPerTokenPaid[_account];
        uint256 currentRewardPerToken = rewardPerToken();
        uint256 pastRewards = s_rewards[_account];

        uint256 _earned = ((currentBalance * (currentRewardPerToken - amountPaid))/ 1e18) + pastRewards;
        return _earned;
    }

    function rewardPerToken() public view returns(uint256){
        if (s_totalSupply == 0){
            return s_rewardPerTokenStored;
        }
        return s_rewardPerTokenStored + 
        (((block.timestamp - s_lastUpdateTime)*REWARD_RATE*1e18)/s_totalSupply);

    }

    // Do we allow any token
    // or specific token 
    // We will need Chainlink to know the exchange price

    function stake(uint256 _amount) external updateReward(msg.sender) moreThanZero(_amount) {
        
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

    function withdraw(uint256 _amount )external updateReward(msg.sender) moreThanZero(_amount){

        s_balances[msg.sender]=s_balances[msg.sender] - _amount;

        s_totalSupply  = s_totalSupply - _amount;

        bool success = s_stakingToken.transfer( msg.sender , _amount);

        if(!success){
            revert Staking__TransferFailed();
        }
    }

    function claimReward() external updateReward(msg.sender) {

        uint256 reward = s_rewards[msg.sender];

        bool success = s_rewardToken.transfer(msg.sender, reward);

        if (!success){
            revert Staking__TransferFailed();
        }

        //how much reward do they get
        // token will emit x token / sec

    }

   


}