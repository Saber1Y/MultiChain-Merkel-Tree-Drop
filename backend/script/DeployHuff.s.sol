// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {HuffDeployer, HuffConfig} from "lib/foundry-huff/src/HuffDeployer.sol";

contract DeployHuff is Script {
    // point to the new huff source under src/TSender
    string public constant tsenderHuffLocation = "src/TSender";

    function run() public {
        HuffConfig huffConfig = HuffDeployer.config();

        vm.startBroadcast();
        address huffTSender = deployHuff(huffConfig);
        vm.stopBroadcast();

        console2.log("TSender Huff deployed to:", huffTSender);
    }

    function deployHuff(HuffConfig config) public returns (address) {
        return config.deploy(tsenderHuffLocation);
    }
}
