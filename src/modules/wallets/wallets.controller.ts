import { Controller } from '@nestjs/common';

@Controller('wallets')
export class WalletsController {
  constructor() {} // private readonly walletsService: WalletsService

  // @Get(':userId')
  // async getBalance(
  //   @Param('userId', ParseIntPipe) userId: number,
  // ): Promise<WalletDto> {
  //   const wallet = await this.walletsService.findOrCreateWalletByUserId(userId);
  //   return plainToInstance(WalletDto, wallet);
  // }

  // @Put(':userId')
  // async updateWallet(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Body() dto: UpdateWalletDto,
  // ): Promise<WalletDto> {
  //   let wallet: Wallet;
  //   if (dto.operation === 'credit') {
  //     wallet = await this.walletsService.credit(userId, dto.amount);
  //   } else if (dto.operation === 'debit') {
  //     wallet = await this.walletsService.debit(userId, dto.amount);
  //   }
  //   return plainToInstance(WalletDto, wallet);
  // }
}
