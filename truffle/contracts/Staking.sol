// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public stakingToken;

    uint256 private totalSupply;
    uint256 private lockedTime = 4 weeks;

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

    function stake(uint256 _amount, bool _locked) external {
        require(_amount > 0, "Stake amount need to be more than 0");
        if (_locked) {
            lockedBalances[msg.sender] = LockedStaking(_amount, block.timestamp);
        } else {
            balances[msg.sender] += _amount;
        }
        totalSupply += _amount;
        emit Stake(msg.sender, _amount);
        bool success = stakingToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");
    }

    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Balance need to be more than 0");
        totalSupply -= _amount;
        balances[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
        bool success = stakingToken.transfer(msg.sender, _amount);
        require(success, "Transfer failed");
    }

    function withdrawLocked() external {
        // require(LockedStaking[msg.sender].timestamp > 0, "Withdrawal is not yet possible");
        // lockedBalances[msg.sender].timestamp + lockedTime > block.timestamp;
    }
}