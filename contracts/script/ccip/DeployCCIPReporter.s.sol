// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../../src/chainlink/CCIPReporter.sol";
import "../../src/chainlink/CCIPAdapter.sol";

contract CCIP is Script {
    function run() external {
        // read deployer key and start broadcasting
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        vm.startBroadcast(pk);

        //
        // Deploy & configure CCIPReporter
        //
        address headerStorage = vm.envAddress("HEADER_STORAGE");
        address yaho = vm.envAddress("YAHO_ADDRESS");
        address router1 = vm.envAddress("CCIP_ROUTER_REPORTER");

        CCIPReporter reporter = new CCIPReporter(headerStorage, yaho, router1);
        console.log("CCIPReporter deployed at:", address(reporter));

        // read chain‐specific setup from env
        uint256 reportChainId = vm.envUint("REPORT_CHAIN_ID");
        uint64 reportChainSelector = uint64(vm.envUint("REPORT_CHAIN_SELECTOR"));

        // set the selector
        reporter.setChainSelectorByChainId(reportChainId, reportChainSelector);

        vm.stopBroadcast();
    }
}
