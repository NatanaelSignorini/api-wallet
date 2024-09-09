import { IsInt, IsOptional, Min } from 'class-validator';

export class BaseInputWhere {
  @IsOptional()
  id?: string;
}

export class BaseFilter {
  @IsOptional()
  @IsInt()
  @Min(0)
  take?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  order?: BaseInputWhere;

  @IsOptional()
  where?: BaseInputWhere;
}
