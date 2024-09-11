import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RolesEnum } from '../roles/enum/role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import * as consts from './../../common/constants/error.constants';
import { TransfersRepository } from './repository/transfers.repository';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    private readonly transfersRepository: TransfersRepository,
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
    private readonly dataSource: DataSource,
  ) {}

  async createNewTransfer(
    user: User,
    payeeId: string,
    amount: number,
  ): Promise<void> {
    const payer = await this.usersService.findOneUser({
      where: [{ id: user.id }],
    });

    if (!payer) {
      throw new BadRequestException(consts.PAYER_NOT_FOUND);
    }

    const payee = await this.usersService.findOneUser({
      where: [{ id: payeeId }],
    });

    if (!payee) {
      throw new BadRequestException(consts.PAYEE_NOT_FOUND);
    }

    if (payer.role.name === RolesEnum.USER) {
      const payerWallet = await this.walletsService.findWalletByUserId(
        payer.id,
      );
      if (payerWallet.balance < amount) {
        throw new BadRequestException(consts.BALANCE_INSUFFICIENT);
      }
    }

    await this.performTransfer(payer.id, payeeId, amount);
  }

  private async performTransfer(
    payerId: string,
    payeeId: string,
    amount: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Perform the debit and credit operations within the transaction
      await this.walletsService.debit(payerId, amount, queryRunner.manager);
      await this.walletsService.credit(payeeId, amount, queryRunner.manager);

      // Create and save the transfer record within the transaction
      const transfer = this.transfersRepository.create({
        payerId,
        payeeId,
        amount,
      });
      await queryRunner.manager.save(transfer);

      // Commit the transaction
      await queryRunner.commitTransaction();

      // // Notify the payee outside of the transaction
      // await this.notificationsService.notify(
      //   payeeId,
      //   `You have received ${amount} from ${payerId}`,
      // );

      // this.logger.debug(
      //   `Transfer completed: ${amount} from ${payerId} to ${payeeId}`,
      // );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transfer failed: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
