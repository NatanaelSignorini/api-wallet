import { IsEnum, IsString } from 'class-validator';
import { BaseDTO } from 'src/modules/bases/dto/base.dto';
import { RolesEnum } from '../enum/role.enum';

export class RoleDTO extends BaseDTO {
  @IsString()
  @IsEnum(RolesEnum)
  name: string;
}
