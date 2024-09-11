import { Module } from '@nestjs/common';
import { EventSourcingModule } from '../event-sourcing/event-sourcing.module';
import { WalletsRepository } from './repository/wallets.repository';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [EventSourcingModule],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
