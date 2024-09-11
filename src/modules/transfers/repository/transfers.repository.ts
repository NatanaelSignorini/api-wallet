import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';

@Injectable()
export class TransfersRepository extends Repository<Transfer> {
  constructor(dataSource: DataSource) {
    super(Transfer, dataSource.manager);
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    return this.find({ where: [{ payerId: userId }, { payeeId: userId }] });
  }
}
