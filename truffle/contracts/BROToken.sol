// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BROToken is ERC20 {
    constructor() ERC20("Bropsten Token", "BRO") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function faucet(address _recipient) external {
        _mint(_recipient, 1000 * 10 ** 18);
    }
}