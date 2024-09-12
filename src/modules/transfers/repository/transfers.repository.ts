import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';

@Injectable()
export class TransfersRepository extends Repository<Transfer> {
  constructor(dataSource: DataSource) {
    super(Transfer, dataSource.manager);
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    return this.find({ where: [{ payerId: userId }, { payeeId: userId }] });
  }

  async findByTranferIdAndPayerId(
    payerId: string,
    transactionId: string,
  ): Promise<Transfer> {
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
