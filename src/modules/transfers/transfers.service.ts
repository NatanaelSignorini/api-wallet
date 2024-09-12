import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RolesEnum } from '../roles/enum/role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import * as consts from './../../common/constants/error.constants';
import { Transfer } from './entities/transfer.entity';
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

  async createNewDeposit(user: User, amount: number): Promise<void> {
    const payer = await this.usersService.findOneUser({
      where: [{ id: user.id }],
    });

    if (!payer) {
      throw new BadRequestException(consts.PAYER_NOT_FOUND);
    }

    if (payer.role.name === RolesEnum.USER) {
      const payerWallet = await this.walletsService.findWalletByUserId(
        payer.id,
      );

      if (payerWallet) {
        await this.performDeposit(payer.id, amount);
      }
    }
  }

  async createNewRefund(user: User, transactionId: string): Promise<void> {
    const payerId = user.id;
    const transfer = await this.transfersRepository.findByTranferIdAndPayerId(
      payerId,
      transactionId,
    );

    if (!transfer) {
      throw new BadRequestException(consts.TRANSFER_INVALID);
    }

    await this.performRefund(transfer);
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
      const transfer = this.transfersRepository.create({
        payerId,
        payeeId,
        amount,
        valideReverse: true,
      });

      const transferData = await queryRunner.manager.save(transfer);

      await this.walletsService.debit(
        payerId,
        amount,
        transferData,
        queryRunner.manager,
      );
      await this.walletsService.credit(
        payeeId,
        amount,
        transferData,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      this.logger.debug(
        `Transfer completed: TransactionID: ${transferData.id}, Value: ${amount} from ${payerId} to ${payeeId}`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transfer failed: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async performDeposit(payerId: string, amount: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transfer = this.transfersRepository.create({
        payerId,
        amount,
        valideReverse: false,
      });

      const transferData = await queryRunner.manager.save(transfer);

      await this.walletsService.deposit(
        payerId,
        amount,
        transferData,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      this.logger.debug(
        `Deposit completed: TransactionID: ${transferData.id}, Value: ${amount}`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Deposit failed: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async performRefund(transfer: Transfer): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      transfer.valideReverse = false;
      await queryRunner.manager.save(transfer);

      const newTransfer = this.transfersRepository.create({
        payerId: transfer.payeeId,
        payeeId: transfer.payerId,
        amount: -Number(transfer.amount),
        valideReverse: false,
      });

      const transferData = await queryRunner.manager.save(newTransfer);

      await this.walletsService.refund(transferData, queryRunner.manager);

      await queryRunner.commitTransaction();

      this.logger.debug(`Refund completed: TransactionID: ${transferData.id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Deposit failed: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
