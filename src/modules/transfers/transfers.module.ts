import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { Transfer } from './entities/transfer.entity';
import { TransfersRepository } from './repository/transfers.repository';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), UsersModule, WalletsModule],
  providers: [TransfersService, TransfersRepository],
  exports: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
