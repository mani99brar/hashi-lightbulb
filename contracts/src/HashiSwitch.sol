// SPDX-License-Identifier: MIT

/**
 *  @authors: [@shotaronowhere]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 */

pragma solidity ^0.8.18;

import "@hashi/interfaces/IYaho.sol";

/**
 * @title Lightbulb
 * @dev A switch on arbitrum turning a light on and off on arbitrum with the Vea bridge.
 */
contract Switch{
    address public immutable lightBulb; 
    uint256 messageIndex;
    IYaho public yaho = IYaho(0xDbdF80c87f414fac8342e04D870764197bD3bAC7);
    /**
     * @dev The Fast Bridge participants watch for these events to decide if a challenge should be submitted.
     * @param messageId The id of the message sent to the lightbulb.
     * @param lightBulbOwner The address of the owner of the lightbulb on the L2 side.
     */
    event LightBulbToggled(uint256 indexed messageId, address indexed lightBulbOwner);

    constructor(address _lightBulb) {
        lightBulb = _lightBulb;
    }

    function turnOnLightBulb(address _targetAddress,uint256 _threshold,IReporter[] memory _reporters, IAdapter[] memory _adapters) external payable {
        bytes memory _msgData = abi.encode(msg.sender);

        (uint256 msgId,)=yaho.dispatchMessageToAdapters(10200, _threshold, _targetAddress, _msgData, _reporters, _adapters);
        emit LightBulbToggled(msgId, msg.sender);
    }
}