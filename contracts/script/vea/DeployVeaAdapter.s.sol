// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../../src/vea/VeaAdapter.sol";
import "../../src/vea/VeaReporter.sol";
import {IVeaInbox} from "../../src/vea/interfaces/IVeaInbox.sol";

contract DeployVea is Script {
    function run() external {
        // start broadcasting as your deployer
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        vm.startBroadcast(pk);

        //
        // Deploy the adapter first
        //
        address veaOutbox = vm.envAddress("VEA_OUTBOX");
        uint256 sourceChain = vm.envUint("SOURCE_CHAIN_ID");
        VeaAdapter adapter = new VeaAdapter(veaOutbox, sourceChain);
        console.log("VeaAdapter deployed at:", address(adapter));

        address reporter = vm.envAddress("VEA_REPORTER");
        adapter.setReporter(reporter);
        console.log(" adapter.setReporter(", reporter, ")");

        vm.stopBroadcast();
    }
}
