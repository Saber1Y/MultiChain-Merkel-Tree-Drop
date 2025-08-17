// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {HuffDeployer, HuffConfig} from "lib/foundry-huff/src/HuffDeployer.sol";

contract DeployHuff is Script {

    string public constant tsenderHuffLocation = "TSender/TSender";

    function run() public {
        // Create a HuffConfig that will broadcast internally. This avoids using vm.prank during a
        // broadcasted transaction which Foundry disallows.
        HuffConfig huffConfig = HuffDeployer.config().set_broadcast(true);

        address huffTSender = deployHuff(huffConfig);

        console2.log("TSender Huff deployed to:", huffTSender);
    }

    function deployHuff(HuffConfig config) public returns (address) {
        return config.deploy(tsenderHuffLocation);
    }
}
