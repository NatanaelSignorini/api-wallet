import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WalletDto {
  @Expose()
  id: string;

  @Expose()
  balance: number;
}
