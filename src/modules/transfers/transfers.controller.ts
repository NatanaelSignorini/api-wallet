import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/auth.roles.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesEnum } from '../roles/enum/role.enum';
import { User } from '../users/entities/user.entity';
import { TransfersService } from './transfers.service';

@ApiBearerAuth()
@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Transfers Wallets' })
  @ApiResponse({
    status: 201,
    description: 'Transfers Wallets Successful',
  })
  async transfer(
    @CurrentUser() user: User,
    @Body('payee') payeeId: string,
    @Body('value') amount: number,
  ): Promise<{ message: string }> {
    await this.transfersService.createNewTransfer(user, payeeId, amount);
    return { message: 'Transfer successful' };
  }

  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  @ApiOperation({ summary: 'Deposit Wallet' })
  @ApiResponse({
    status: 201,
    description: 'Deposit Wallet Successful',
  })
  async deposit(
    @CurrentUser() user: User,
    @Body('value') amount: number,
  ): Promise<{ message: string }> {
    await this.transfersService.createNewDeposit(user, amount);
    return { message: 'Deposit successful' };
  }

  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Post('refund')
  @ApiOperation({ summary: 'Refund Wallet' })
  @ApiResponse({
    status: 201,
    description: 'Refund Wallet Successful',
  })
  async refund(
    @CurrentUser() user: User,
    @Body('transactionId') transactionId: string,
  ): Promise<{ message: string }> {
    await this.transfersService.createNewRefund(user, transactionId);
    return { message: 'Refund successful' };
  }
}
