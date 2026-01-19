"use client";

import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../web3/contracts";

export default function WriteContract() {
  const { writeContract, isPending } = useWriteContract();

  return (
    <button
      onClick={() =>
        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "setValue",
          args: [999],
        })
      }
      disabled={isPending}
    >
      {isPending ? "Sending..." : "Set Value"}
    </button>
  );
}
