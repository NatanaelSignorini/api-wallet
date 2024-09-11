import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'The payeeId field cannot be null' })
  payeeId: string;

  @IsString()
  @IsNotEmpty({ message: 'The operation field cannot be null' })
  @IsIn(['credit', 'debit'], {
    message: 'Operation must be either credit or debit',
  })
  operation: 'credit' | 'debit';

  @IsNumber()
  @IsNotEmpty({ message: 'The amount field cannot be null' })
  @Min(0.01, { message: 'Amount must be a positive number greater than 0' })
  amount: number;
}
