"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/app/web3/contracts";

export default function ReadContract() {
  const { isConnected } = useAccount();

  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getValue", // SESUAI CONTRACT
    query: {
      enabled: isConnected,
    },
  });

  if (!isConnected) {
    return <p>Connect wallet first</p>;
  }

  return (
    <div>
      <p>Contract Value:</p>
      {isLoading ? "Loading..." : data?.toString()}
    </div>
  );
}
