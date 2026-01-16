import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { simpleStorageAbi } from '../contracts/simpleStorage.abi';

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    this.contractAddress = '0x0b698849f906D6284D801d1fB503852300640936';
  }

  // ===== STEP 2.5 =====
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: simpleStorageAbi,
        functionName: 'getValue',
      });

      const blockNumber = await this.client.getBlockNumber();

      return {
        value: Number(value),
        blockNumber: Number(blockNumber),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // ===== STEP 2.6 =====
  async getValueUpdatedEvents() {
    try {
      const latestBlock = Number(await this.client.getBlockNumber());
      const fromBlock = Math.max(latestBlock - 10_000, 0);

      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: parseAbiItem('event ValueUpdated(uint256 newValue)'),
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(latestBlock),
      });

      return events.map((event) => ({
        blockNumber: Number(event.blockNumber),
        value: Number(event.args.newValue),
        txHash: event.transactionHash,
      }));
    } catch (error) {
      return [];
    }
  }

  // ===== STEP 2.7 =====
  private handleRpcError(error: any): never {
    const message = error?.message?.toLowerCase() || '';

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException(
        'RPC timeout. Silakan coba beberapa saat lagi.',
      );
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException(
        'Tidak dapat terhubung ke blockchain RPC.',
      );
    }

    throw new InternalServerErrorException(
      'Terjadi kesalahan saat membaca data blockchain.',
    );
  }
}
