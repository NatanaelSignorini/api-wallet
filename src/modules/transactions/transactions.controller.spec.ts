import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    transactionsController = app.get<TransactionsController>(
      TransactionsController,
    );
  });

  it('should befined"', () => {
    expect(transactionsController).toBeDefined();
  });
});
