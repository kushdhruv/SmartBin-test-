// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {SmartBin} from "../src/SmartBin.sol";

contract DeployScript is Script {
    function run() external returns (SmartBin) {
        vm.startBroadcast();
        SmartBin smartBin = new SmartBin();
        vm.stopBroadcast();
        return smartBin;
    }
}
