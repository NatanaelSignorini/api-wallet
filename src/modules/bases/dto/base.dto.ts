import { IsDate, IsOptional, IsUUID } from 'class-validator';

export abstract class BaseDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
