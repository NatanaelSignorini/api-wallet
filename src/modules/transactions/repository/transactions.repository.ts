import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionsRepository extends Repository<Transaction> {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.manager);
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.find({ where: [{ payerId: userId }, { payeeId: userId }] });
  }

  async findByTranferIdAndPayerId(
    payerId: string,
    transactionId: string,
  ): Promise<Transaction> {
    return this.findOne({
      where: {
        id: transactionId,
        payerId: payerId,
        payeeId: Not(IsNull()),
        amount: MoreThan(0),
        valideReverse: true,
      },
    });
  }
}
