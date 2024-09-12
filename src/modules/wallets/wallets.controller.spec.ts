import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

describe('WalletsController', () => {
  let walletsController: WalletsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            findWalletByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    walletsController = app.get<WalletsController>(WalletsController);
  });

  it('should befined"', () => {
    expect(walletsController).toBeDefined();
  });
});
