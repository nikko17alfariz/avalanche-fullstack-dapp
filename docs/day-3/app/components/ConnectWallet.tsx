"use client";

import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();

  if (isConnected) {
    return <p>Connected: {address}</p>;
  }

  return (
    <button onClick={() => connect({ connector: injected() })}>
      Connect Core Wallet
    </button>
  );
}
