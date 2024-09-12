import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransferDTO {
  @Expose()
  message?: string;
}
