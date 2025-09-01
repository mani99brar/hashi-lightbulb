// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@hashi/adapters/LayerZero/LayerZeroAdapter.sol";
import {SetConfigParam} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLibManager.sol";
import {UlnConfig} from "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/UlnBase.sol";
import {
    ILayerZeroEndpointV2
} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

contract DeployLZAdapter is Script {
    uint32 constant RECEIVE_CONFIG_TYPE = 2;
    function run() external {
        // read deployer key and start broadcasting
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        address deployer = vm.addr(pk);
        address lzEndpoint = vm.envAddress("LZ_ENDPOINT");
        uint32 eid = uint32(vm.envUint("EID"));
        address reporter = vm.envAddress("LZ_REPORTER_ADDRESS");
        uint256 chainId = vm.envUint("LZ_REPORTER_CHAIN_ID");
        address receiveLib= vm.envAddress("RECEIVE_LIB");

        vm.startBroadcast(pk);
        LayerZeroAdapter adapter = new LayerZeroAdapter(
            lzEndpoint,
            deployer
        );
        console.log("Deployed LayerZeroAdapter at:", address(adapter));

        // Allow the reporter to send messages
        adapter.setPeer(eid,  bytes32(uint256(uint160(reporter))));
        console.log("Reporter allowed as peer");

        // Set reporter as the message sender
        adapter.setReporterByChain(chainId, eid, address(reporter));
        console.log("Reporter set for chainId");

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

        bytes memory encodedUln = abi.encode(uln);

        SetConfigParam[] memory params = new SetConfigParam[](1);
        params[0] = SetConfigParam(eid, RECEIVE_CONFIG_TYPE, encodedUln);

        ILayerZeroEndpointV2(lzEndpoint).setConfig(address(adapter), receiveLib, params);
        console.log("Config set successfully.");

        vm.stopBroadcast();
    }
}
