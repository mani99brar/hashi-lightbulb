// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@hashi/adapters/LayerZero/LayerZeroReporter.sol";
import {SetConfigParam} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLibManager.sol";
import {UlnConfig} from "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/UlnBase.sol";
import { ExecutorConfig } from "@layerzerolabs/lz-evm-messagelib-v2/contracts/SendLibBase.sol";
import {MessageLibManager} from "@layerzerolabs/lz-evm-protocol-v2/contracts/MessageLibManager.sol";

contract DeployLZReporter is Script {
    uint32 constant EXECUTOR_CONFIG_TYPE = 1;
    uint32 constant ULN_CONFIG_TYPE = 2;
    function run() external {
        // read deployer key and start broadcasting
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        address deployer = vm.addr(pk);

        address headerStorage = vm.envAddress("HEADER_STORAGE");
        address yaho = vm.envAddress("YAHO_ADDRESS");
        address lzEndpoint = vm.envAddress("LZ_ENDPOINT");
        uint128 defaultFee = uint128(vm.envUint("LZ_DEFAULT_FEE"));
        uint256 chainId = vm.envUint("ADAPTER_CHAIN_ID");
        uint32 eid = uint32(vm.envUint("ADAPTER_EID"));
        address sendLib = vm.envAddress("LZ_SEND_LIB");
        address executor = vm.envAddress("LZ_EXECUTOR");
        address reporterAddress = vm.envAddress("LZ_REPORTER_ADDRESS");
        address adapter = vm.envAddress("LZ_ADAPTER_ADDRESS");

        vm.startBroadcast(pk);
        LayerZeroReporter reporter = LayerZeroReporter(payable(reporterAddress));
        console.log("Deployed LayerZeroReporter at:", address(reporter));

        // Allow the adapter to receive messages
        reporter.setPeer(eid, bytes32(uint256(uint160(adapter))));
        console.log("Peer set for adapter");

        reporter.setEndpointIdByChainId(chainId, eid);
        console.log("Endpoint set for adapter chainId");

        (bool success, ) = payable(address(reporter)).call{value: 0.01 ether}("");
        require(success, "ETH transfer to reporter failed");
        console.log("Funded reporter with 0.01 ETH");

        // Set the DVN config as reporter
        address[] memory optionalDVNs = new address[](0);
        address[] memory requiredDVNs = new address[](2);
        requiredDVNs[1] = address(0xeFd1d76A2DB92bAd8FD56167f847D204f5F4004E);
        requiredDVNs[0] = address(0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193);

        UlnConfig memory uln = UlnConfig({
            confirmations: 15, // minimum block confirmations required
            requiredDVNCount: 2, // number of DVNs required
            optionalDVNCount: type(uint8).max, // optional DVNs count, uint8
            optionalDVNThreshold: 0, // optional DVN threshold
            requiredDVNs: requiredDVNs, // sorted list of required DVN addresses
            optionalDVNs: optionalDVNs // sorted list of optional DVNs
        });

         /// @notice ExecutorConfig sets message size limit + fee‑paying executor
        ExecutorConfig memory exec = ExecutorConfig({
            maxMessageSize: 10000,                                       // max bytes per cross-chain message
            executor:       executor                                     // address that pays destination execution fees
        });

        bytes memory encodedUln  = abi.encode(uln);
        bytes memory encodedExec = abi.encode(exec);

        SetConfigParam[] memory params = new SetConfigParam[](2);
        params[0] = SetConfigParam(eid, EXECUTOR_CONFIG_TYPE, encodedExec);
        params[1] = SetConfigParam(eid, ULN_CONFIG_TYPE, encodedUln);

        // ILayerZeroEndpointV2(lzEndpoint).setReceiveLibrary(address(adapter), eid, receiveLib,1);
        // console.log("Receive library set successfully.");

        MessageLibManager(lzEndpoint).setConfig(address(reporter), sendLib, params);
        console.log("Config set successfully.");



        vm.stopBroadcast();
    }
}
