import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/decorators/auth.roles.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesEnum } from '../roles/enum/role.enum';
import { User } from '../users/entities/user.entity';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletDto } from './dto/wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletsService } from './wallets.service';

@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Get('userId')
  @ApiOperation({ summary: 'Get Wallet by User' })
  @ApiResponse({
    status: 200,
    description: 'Get Wallet by User',
  })
  async getBalance(@CurrentUser() user: User): Promise<WalletDto> {
    const wallet = await this.walletsService.findWalletByUserId(user.id);
    return plainToInstance(WalletDto, wallet);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Put('userId')
  @ApiOperation({ summary: 'Update Wallet by User' })
  @ApiResponse({
    status: 201,
    description: 'Update Wallet by User',
  })
  async updateWallet(@Body() data: UpdateWalletDto): Promise<WalletDto> {
    await this.walletsService.findWalletByUserId(data.payeeId);

    let wallet: Wallet;
    if (data.operation === 'credit') {
      wallet = await this.walletsService.credit(data.payeeId, data.amount);
    } else if (data.operation === 'debit') {
      wallet = await this.walletsService.debit(data.payeeId, data.amount);
    }
    return plainToInstance(WalletDto, wallet);
  }
}
