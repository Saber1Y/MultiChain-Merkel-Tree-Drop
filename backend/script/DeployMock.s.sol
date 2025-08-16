// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Mocks/MockERC20.sol";

contract DeployMock is Script {
    function run() external {
        uint256 initialSupply = 1000 ether; 

        vm.startBroadcast();
        MockERC20 token = new MockERC20("Mock Token", "MTK", initialSupply);
        console.log("Deployed MockERC20 at:");
        console.logAddress(address(token));
        vm.stopBroadcast();
    }
}
