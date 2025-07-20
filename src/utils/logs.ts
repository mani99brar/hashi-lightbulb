import { publicClient } from "@/utils/viemClient";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import { parseAbiItem, decodeEventLog, Address } from "viem";
import { SWITCH_ADDRESS } from "@/utils/consts";

/**
 * Represents a decoded lightBulbToggled event
 */
export interface LightBulbToggledEvent {
  messageId: bigint;
  lightBulbOwner: Address;
}

/**
 * Fetches all lightBulbToggled events from the Switch contract
 *
 * @param fromBlock - the starting block (inclusive)
 * @param toBlock - optional ending block (inclusive)
 */
export async function fetchLightBulbToggledEvents(
): Promise<LightBulbToggledEvent[]> {

    // Retrieve raw logs
    const latestBlock = await publicClient.getBlockNumber();
    console.log("Latest block:", latestBlock);
    const logs = await publicClient.getLogs({
        address: SWITCH_ADDRESS,
        fromBlock: latestBlock - BigInt(499),
        toBlock: latestBlock
    });
    console.log(publicClient.chain.id, SWITCH_ADDRESS);
  console.log("Raw logs:", logs);
  // Decode each log entry
  return logs.map((log) => {
    const { args } = decodeEventLog({
      abi: SwitchAbi,
      eventName: "lightBulbToggled",
      data: log.data,
      topics: log.topics,
    });
    return {
      messageId: args?.messageId,
      lightBulbOwner: args?.lightBulbOwner,
    };
  });
}
