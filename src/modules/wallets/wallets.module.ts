import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [],
  providers: [WalletsService],
  exports: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
