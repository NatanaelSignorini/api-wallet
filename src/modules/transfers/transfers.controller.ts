import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/auth.roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesEnum } from '../roles/enum/role.enum';
import { TransfersService } from './transfers.service';

@ApiBearerAuth()
@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Transfers Wallets' })
  @ApiResponse({
    status: 201,
    description: 'Transfers Wallets Successful',
  })
  async transfer(
    @Body('payer') payerId: string,
    @Body('payee') payeeId: string,
    @Body('value') amount: number,
  ): Promise<{ message: string }> {
    await this.transfersService.createNewTransfer(payerId, payeeId, amount);
    return { message: 'Transfer successful' };
  }
}
