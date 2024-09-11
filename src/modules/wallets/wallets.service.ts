import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './repository/wallets.repository';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async credit(
    userId: string,
    amount: number,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    // wallet.credit(amount);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async debit(
    userId: string,
    amount: number,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    // wallet.debit(amount);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async findWalletByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<Wallet> {
    console.log('chegou aqui');
    let wallet = await this.walletsRepository.findByUserId(userId, manager);
    if (!wallet) {
      wallet = Wallet.create(userId);
      wallet = await this.walletsRepository.saveWallet(wallet, manager);
      console.log('chegou aqui2');
    }
    return wallet;
  }

  async createWalletByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<Wallet> {
    let wallet = Wallet.create(userId);
    wallet = await this.walletsRepository.saveWallet(wallet, manager);

    return wallet;
  }
}
