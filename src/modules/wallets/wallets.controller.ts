import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { WalletDto } from './dto/wallet.dto';
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
  async getWalletAndBalance(@CurrentUser() user: User): Promise<WalletDto> {
    const wallet = await this.walletsService.findWalletByUserId(user.id);
    return plainToInstance(WalletDto, wallet);
  }
}
