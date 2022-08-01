// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public stakingToken;

    uint256 private totalSupply;
    uint256 private rewardPerTokenStored;
    uint256 private lastUpdateTime;
    uint256 private lockedTime = 4 weeks;
    uint256 private REWARD_RATE = 100;
    uint256 private LOCKED_REWARD_RATE = 150;

    struct LockedStaking {
        uint256 balance;
        uint256 deadline;
    }

    event Stake(address user, uint256 amount);
    event Withdraw(address user, uint256 amount);

    mapping(address => uint256) public balances;
    mapping(address => LockedStaking) public lockedBalances;

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @notice Tokens staking
     * @param _amount the amount of tokens
     * @param _locked specify id staking should be locked or not
     */
    function stake(uint256 _amount, bool _locked) external {
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
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Balance need to be more than 0");
        totalSupply -= _amount;
        balances[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
        bool success = stakingToken.transfer(msg.sender, _amount);
        require(success, "Transfer failed");
    }

    /**
     * @notice Widthraw tokens from locked staking balance, all tokens will be withdrawn
     * @dev The staking deadline is reset
     */
    function withdrawLocked() external {
        require(lockedBalances[msg.sender].balance > 0, "Balance is empty");
        require(block.timestamp > lockedBalances[msg.sender].deadline, "Withdrawal is not yet possible");
        uint256 amount = lockedBalances[msg.sender].balance;
        totalSupply -= amount;
        lockedBalances[msg.sender].balance = 0;
        lockedBalances[msg.sender].deadline = 0;
        emit Withdraw(msg.sender, amount);
        bool success = stakingToken.transfer(msg.sender, amount);
        require(success, "Transfer failed");
    }

    /**
     * @notice Calculate the reward for each staked token
     */
    function rewardPerToken() external view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * REWARD_RATE * 1e18) / totalSupply);
    }

    /**
     * @notice How much reward did a user get
     */
    function earned(address _account, bool _locked) external returns (uint256) {
        
    }
}