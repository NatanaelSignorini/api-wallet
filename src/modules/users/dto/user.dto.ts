import { Exclude, Expose } from 'class-transformer';
import { BaseDTO } from 'src/modules/bases/dto/base.dto';
import { RoleDTO } from 'src/modules/roles/dto/role.dto';

@Exclude()
export class UserDTO extends BaseDTO {
  @Expose()
  fullName?: string;

  @Expose()
  cpfCnpj?: string;

  @Expose()
  email?: string;

  @Expose()
  lastLogin?: Date;

  @Expose()
  // @Type(() => RoleDTO)
  role?: RoleDTO;
}
