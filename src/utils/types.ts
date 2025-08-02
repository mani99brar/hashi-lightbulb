// 1) Define the shape of the event-args:
interface MessageDispatchedArgs {
  messageId: bigint;
  message: {
    nonce: bigint;
    sender: `0x${string}`;
    data: `0x${string}`;
  };
}

// 2) Define the decoded-log shape:
export interface MessageDispatchedLog {
  eventName: "MessageDispatched";
  args: MessageDispatchedArgs;
}
