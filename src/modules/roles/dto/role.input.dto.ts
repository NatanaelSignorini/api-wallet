import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from '../enum/role.enum';

export class RoleInputDTO {
  @IsString()
  @IsEnum(RolesEnum)
  name: string;
}
