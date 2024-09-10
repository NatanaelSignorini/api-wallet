import { Expose } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export abstract class BaseDTO {
  @IsOptional()
  @IsUUID()
  @Expose()
  id?: string;

  @IsOptional()
  @IsDate()
  @Expose()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  deletedAt?: Date;
}
