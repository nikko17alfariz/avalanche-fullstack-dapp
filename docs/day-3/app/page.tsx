"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";

// ==============================
// 🔹 CONTRACT CONFIG
// ==============================
const CONTRACT_ADDRESS = "0x0b698849f906d6284d801d1fb503852300640936";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Page() {
  // ==============================
  // 🔹 STATE & HYDRATION FIX
  // ==============================
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // ==============================
  // 🔹 WAGMI HOOKS
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
    query: { enabled: isConnected },
  });

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
  } = useWriteContract();

  const { isSuccess: isTxSuccess, isLoading: isTxLoading } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setInputValue("");
    }
  }, [isTxSuccess, refetch]);

  const handleSetValue = () => {
    if (!isConnected || !inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  if (!mounted) return null;

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 space-y-6">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full" />

        {/* Header */}
        <div className="text-center space-y-1 relative">
          <h1 className="text-2xl font-bold tracking-wide">Avalanche dApp</h1>
          <p className="text-xs text-gray-400">SimpleStorage · Read & Write</p>
        </div>

        {/* Wallet */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-60"
          >
            {isConnecting ? "Connecting…" : "Connect Core Wallet"}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Connected Address</p>
            <p className="font-mono text-xs break-all text-white/90">
              {address}
            </p>
            <button
              onClick={() => disconnect()}
              className="text-xs text-red-400 hover:underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Value */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-xs text-gray-400">Stored Value</p>
          <div className="text-center text-4xl font-extrabold">
            {isReading ? "…" : value?.toString()}
          </div>
          <button
            onClick={() => refetch()}
            className="block mx-auto text-xs text-blue-400 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Write */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <p className="text-xs text-gray-400">Set New Value</p>

          <input
            type="number"
            placeholder="e.g. 123"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting || isTxLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {isWriting || isTxLoading ? "Updating…" : "Set Value"}
          </button>
        </div>

        {/* TX */}
        {txHash && (
          <p className="text-[10px] text-gray-500 break-all text-center">
            TX: {txHash}
          </p>
        )}

        <p className="text-[10px] text-gray-500 text-center">
          Avalanche Fuji · Core Wallet
        </p>
      </div>
    </main>
  );
}
