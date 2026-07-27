import { decodeEventLog, Address } from "viem";
import { ensureChain } from "@/utils/viem";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import type { Route } from "@/utils/consts";

/**
 * Represents a decoded lightBulbToggled event
 */
export interface LightBulbToggledEvent {
  messageId: bigint;
  lightBulbOwner: Address;
}

type LightbulbLog = {
  messageId: bigint;
  lightBulbOwner: Address;
};

/**
 * Fetches all lightBulbToggled events from the Switch contract
 *
 * @param route - the route whose source-chain Switch is queried
 */
export async function fetchLightBulbToggledEvents(
  route: Route
): Promise<LightBulbToggledEvent[]> {
  const { publicClient: sourcePublicClient } = await ensureChain(route.source);
  // Retrieve raw logs
  const latestBlock = await sourcePublicClient.getBlockNumber();
  console.log("Latest block:", latestBlock);
  const logs = await sourcePublicClient.getLogs({
    address: route.switch,
    fromBlock: latestBlock - BigInt(499),
    toBlock: latestBlock,
  });

  // Decode each log entry
  return logs.map((log) => {
    const { args } = decodeEventLog({
      abi: SwitchAbi,
      eventName: "lightBulbToggled",
      data: log.data,
      topics: log.topics,
    }) as unknown as { eventName: string; args: LightbulbLog };
    return {
      messageId: args?.messageId,
      lightBulbOwner: args?.lightBulbOwner,
    };
  });
}
