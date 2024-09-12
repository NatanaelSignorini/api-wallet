import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

const mockUser: Partial<User> = {
  id: uuidv4(),
  fullName: 'John Doe',
  cpfCnpj: '123.456.789-00',
  email: 'johndoe@example.com',
};

const mockUser2: Partial<User> = {
  id: uuidv4(),
  fullName: 'Alice Smith',
  cpfCnpj: '321.654.987-00',
  email: 'alicesmith@example.com',
};

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createNewTransfer: jest.fn(),
            createNewDeposit: jest.fn(),
            createNewRefund: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should befined"', () => {
    expect(transactionsController).toBeDefined();
    expect(transactionsService).toBeDefined();
  });

  describe('transfer', () => {
    it('should successfully transfer', async () => {
      const user: User = mockUser as User;
      const user2: User = mockUser2 as User;
      const payeeId = user2.id;
      const amount = 100;
      jest
        .spyOn(transactionsService, 'createNewTransfer')
        .mockResolvedValueOnce(undefined);

      const result = await transactionsController.transfer(
        user,
        payeeId,
        amount,
      );
      expect(result).toEqual({ message: 'Transfer successful' });
      expect(transactionsService.createNewTransfer).toHaveBeenCalledWith(
        user,
        payeeId,
        amount,
      );
    });

    it('should handle transfer failure', async () => {
      const user: User = mockUser as User;
      const user2: User = mockUser2 as User;
      const payeeId = user2.id;
      const amount = 100;
      jest
        .spyOn(transactionsService, 'createNewTransfer')
        .mockRejectedValueOnce(new Error('Transfer failed'));

      await expect(
        transactionsController.transfer(user, payeeId, amount),
      ).rejects.toThrow('Transfer failed');
    });
  });

  describe('deposit', () => {
    it('should successfully deposit', async () => {
      const user: User = mockUser as User;
      const amount = 100;
      jest
        .spyOn(transactionsService, 'createNewDeposit')
        .mockResolvedValueOnce(undefined);

      const result = await transactionsController.deposit(user, amount);
      expect(result).toEqual({ message: 'Deposit successful' });
      expect(transactionsService.createNewDeposit).toHaveBeenCalledWith(
        user,
        amount,
      );
    });

    it('should handle deposit failure', async () => {
      const user: User = mockUser as User;
      const amount = 100;
      jest
        .spyOn(transactionsService, 'createNewDeposit')
        .mockRejectedValueOnce(new Error('Deposit failed'));

      await expect(
        transactionsController.deposit(user, amount),
      ).rejects.toThrow('Deposit failed');
    });
  });

  describe('refund', () => {
    it('should successfully refund', async () => {
      const user: User = mockUser as User;
      const transactionId = 'transaction1';
      jest
        .spyOn(transactionsService, 'createNewRefund')
        .mockResolvedValueOnce(undefined);

      const result = await transactionsController.refund(user, transactionId);
      expect(result).toEqual({ message: 'Refund successful' });
      expect(transactionsService.createNewRefund).toHaveBeenCalledWith(
        user,
        transactionId,
      );
    });

    it('should handle refund failure', async () => {
      const user: User = mockUser as User;
      const transactionId = 'transaction1';
      jest
        .spyOn(transactionsService, 'createNewRefund')
        .mockRejectedValueOnce(new Error('Refund failed'));

      await expect(
        transactionsController.refund(user, transactionId),
      ).rejects.toThrow('Refund failed');
    });
  });
});
