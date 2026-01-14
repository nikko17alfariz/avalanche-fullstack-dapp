import {
  createWalletClient,
  http,
  publicActions,
  getContractAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji } from "viem/chains";
import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Menyiapkan deployment ke Avalanche Fuji...");

  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error("PRIVATE_KEY mana bro? Cek .env!");

  const account = privateKeyToAccount(privateKey);

  // Ambil artifact hasil compile tadi
  const artifact = await hre.artifacts.readArtifact("SimpleStorage");

  const client = createWalletClient({
    account,
    chain: avalancheFuji,
    transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
  }).extend(publicActions);

  console.log(`📡 Deploying dengan address: ${account.address}`);

  const hash = await client.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode as `0x${string}`,
  });

  console.log("⏳ Menunggu transaksi masuk block...");
  const receipt = await client.waitForTransactionReceipt({ hash });

  console.log(`✅ MANTAP BRO! Berhasil dideploy!`);
  console.log(`📍 Contract Address: ${receipt.contractAddress}`);
}

main().catch((error) => {
  console.error("❌ Waduh, ada error pas deploy:", error);
  process.exitCode = 1;
});
