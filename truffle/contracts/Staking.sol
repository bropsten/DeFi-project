// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public stakingToken;
    IERC20 public rewardsToken;

    uint256 public totalSupply;
    uint256 public rewardPerTokenStored;
    uint256 private lastUpdateTime;
    uint256 private lockedTime = 4 weeks;
    uint256 private REWARD_RATE = 100;
    uint256 private LOCKED_REWARD_RATE = 150;

    struct LockedStaking {
        uint256 balance;
        uint256 deadline;
    }

    event Stake(address user, uint256 amount);
    event WithdrawStake(address user, uint256 amount);
    event RewardsClaimed(address user, uint256 amount);

    mapping(address => uint256) public balances;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewardsBalance;
    mapping(address => LockedStaking) public lockedBalances;

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewardsBalance[_account] = earned(_account);
        userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        _;
    }

    /**
     * @notice Tokens staking
     * @param _amount the amount of tokens
     * @param _locked specify if staking should be locked or not
     */
    function stake(uint256 _amount, bool _locked) external updateReward(msg.sender) {
        require(_amount > 0, "Stake amount need to be more than 0");
        if (_locked) {
            require(lockedBalances[msg.sender].deadline == 0, "An amount is already locked");
            uint256 deadline = block.timestamp + lockedTime;
            lockedBalances[msg.sender] = LockedStaking(_amount, deadline);
        } else {
            balances[msg.sender] += _amount;
        }

        totalSupply += _amount;
        emit Stake(msg.sender, _amount);
        bool success = stakingToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");
    }

    /**
     * @notice Widthraw tokens from staking balance
     * @param _amount the amount of tokens
     */
    function withdraw(uint256 _amount) external updateReward(msg.sender) {
        require(balances[msg.sender] >= _amount, "The amount is greater than the balance");
        totalSupply -= _amount;
        balances[msg.sender] -= _amount;
        emit WithdrawStake(msg.sender, _amount);
        bool success = stakingToken.transfer(msg.sender, _amount);
        require(success, "Transfer failed");
    }

    /**
     * @notice Widthraw tokens from locked staking balance, all tokens will be withdrawn
     * @dev The staking deadline is reset to 0
     */
    function withdrawLocked() external updateReward(msg.sender) {
        require(lockedBalances[msg.sender].balance > 0, "Balance is empty");
        require(block.timestamp > lockedBalances[msg.sender].deadline, "Withdrawal is not yet possible");
        uint256 amount = lockedBalances[msg.sender].balance;
        totalSupply -= amount;
        lockedBalances[msg.sender].balance = 0;
        lockedBalances[msg.sender].deadline = 0;
        emit WithdrawStake(msg.sender, amount);
        bool success = stakingToken.transfer(msg.sender, amount);
        require(success, "Transfer failed");
    }

    /**
     * @notice Calculate the reward for each staked token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * REWARD_RATE * 1e18) / totalSupply);
    }

    /**
     * @notice User can claim their rewards tokens
     */
    function claimReward() external updateReward(msg.sender) {
        uint256 reward = rewardsBalance[msg.sender];
        rewardsBalance[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = rewardsToken.transfer(msg.sender, reward);
        require(success, "Transfer failed");
    }

    /**
     * @notice How much reward did a user get
     * @param _account the user account
     * @return how many tokens the user has won since the last call to the contract
     */
    function earned(address _account) public view returns (uint256) {
        return 
            ((balances[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) 
            / 1e18) + rewardsBalance[_account];
    }

    /**
     * @notice get the staked balance of a user
     * @param _account the user account
     * @return the balance from account
     */
    function getStakedBalance(address _account) public view returns (uint256) {
        return balances[_account];
    }
}