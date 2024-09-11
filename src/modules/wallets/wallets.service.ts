import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as consts from './../../common/constants/error.constants';
import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './repository/wallets.repository';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async findWalletByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<Wallet> {
    let wallet = await this.walletsRepository.findByUserId(userId, manager);

    if (!wallet) {
      throw new BadRequestException(consts.WALLET_NOT_EXISTS);
    }

    wallet = await this.walletsRepository.saveWallet(wallet, manager);
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

  async credit(
    userId: string,
    amount: number,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    wallet.credit(amount);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async debit(
    userId: string,
    amount: number,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    wallet.debit(amount);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }
}
