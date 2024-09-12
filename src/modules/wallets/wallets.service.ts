import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Transaction } from '../transactions/entities/transaction.entity';
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
    const wallet = await this.walletsRepository.findByUserId(userId, manager);

    if (!wallet) {
      throw new BadRequestException(consts.WALLET_NOT_EXISTS);
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

  async credit(
    userId: string,
    amount: number,
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    wallet.credit(amount, transaction);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async debit(
    userId: string,
    amount: number,
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    wallet.debit(amount, transaction);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async deposit(
    userId: string,
    amount: number,
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByUserId(userId, manager);
    wallet.deposit(amount, transaction);
    return await this.walletsRepository.saveWallet(wallet, manager);
  }

  async refund(
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<void> {
    const amount = Number(transaction.amount);
    const payerId = transaction.payerId;
    const payeeId = transaction.payeeId;

    const payerWallet = await this.findWalletByUserId(payerId, manager);
    payerWallet.refund(transaction, amount, true);
    await this.walletsRepository.saveWallet(payerWallet, manager);

    const payeeWallet = await this.findWalletByUserId(payeeId, manager);
    payeeWallet.refund(transaction, amount, false);
    await this.walletsRepository.saveWallet(payeeWallet, manager);
  }
}
