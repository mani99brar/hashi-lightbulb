import { decodeEventLog, Address } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { ensureChain } from "@/utils/viem";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import { SWITCH_ADDRESS } from "@/utils/consts";

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
 * @param fromBlock - the starting block (inclusive)
 * @param toBlock - optional ending block (inclusive)
 */
export async function fetchLightBulbToggledEvents(): Promise<
  LightBulbToggledEvent[]
> {
  const { publicClient: arbSepoliaPublicClient } = await ensureChain(
    arbitrumSepolia.id
  );
  // Retrieve raw logs
  const latestBlock = await arbSepoliaPublicClient.getBlockNumber();
  console.log("Latest block:", latestBlock);
  const logs = await arbSepoliaPublicClient.getLogs({
    address: SWITCH_ADDRESS,
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
