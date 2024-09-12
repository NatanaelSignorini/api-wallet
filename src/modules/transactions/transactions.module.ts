import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';

import { Transaction } from './entities/transaction.entity';

import { TransactionsRepository } from './repository/transactions.repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule,
    WalletsModule,
  ],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
