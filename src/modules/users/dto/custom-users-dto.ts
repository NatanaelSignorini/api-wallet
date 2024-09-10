import { Expose, Type } from 'class-transformer';
import { UserDTO } from './user.dto';

export class CustomUsersDTO {
  @Expose()
  @Type(() => UserDTO)
  nodes: UserDTO[];

  @Expose()
  totalCount?: number;
}
