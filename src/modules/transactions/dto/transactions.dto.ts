import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransactionDTO {
  @Expose()
  message?: string;
}
