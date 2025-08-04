// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.20;

import { Adapter } from "@hashi/adapters/Adapter.sol";
import { IReceiverGateway } from "./interfaces/IReceiverGateway.sol";

contract VeaAdapter is IReceiverGateway, Adapter {
    string public constant PROVIDER = "vea";

    address public immutable VEA_OUTBOX;
    address public REPORTER;
    uint256 public immutable SOURCE_CHAIN_ID;

    error ArrayLengthMissmatch();
    error InvalidVeaOutbox(address veaOutbox, address expectedVeaOutboux);
    error InvalidReporter(address reporter, address expectedReporter);

    constructor(address veaOutbox_, uint256 sourceChainId) {
        VEA_OUTBOX = veaOutbox_;
        SOURCE_CHAIN_ID = sourceChainId;
    }

    modifier onlyFromAuthenticatedVeaSender(address sourceMsgSender) {
        if (msg.sender != VEA_OUTBOX) revert InvalidVeaOutbox(msg.sender, VEA_OUTBOX);
        if (sourceMsgSender != REPORTER) revert InvalidReporter(REPORTER, sourceMsgSender);
        _;
    }

    function setReporter(address reporter) external {
        REPORTER = reporter;
    }
    function senderGateway() external view override returns (address) {
        return REPORTER;
    }

    function veaOutbox() external view override returns (address) {
        return VEA_OUTBOX;
    }

    function storeHashes(
        address source,
        uint256[] memory ids,
        bytes32[] memory hashes
    ) external onlyFromAuthenticatedVeaSender(source) {
        if (ids.length != hashes.length) revert ArrayLengthMissmatch();
        _storeHashes(SOURCE_CHAIN_ID, ids, hashes);
    }

    fallback() external {
        bytes calldata data = msg.data;

        bytes4 selector = bytes4(data[:4]);
        bytes4 STORE_HASHES_SEL = bytes4(
            keccak256("storeHashes(uint256[],bytes32[])")
        );
        require(selector == STORE_HASHES_SEL, "Invalid selector");

        bytes32 padded;
        assembly {
            // calldataload(offset) loads 32 bytes starting at offset
            // data.offset is the location of the first byte of `data`
            padded := calldataload(add(data.offset, 4))
        }
        address reporterAddr = address(uint160(uint256(padded)));
        require(reporterAddr == REPORTER, "Invalid reporter");

        bytes calldata tail = data[4 + 32 :];

        (uint256[] memory ids, bytes32[] memory hashes) = abi.decode(
            tail,
            (uint256[], bytes32[])
        );
        _storeHashes(uint256(SOURCE_CHAIN_ID), ids, hashes);
    }
}
