import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { UserDTO } from 'src/modules/users/dto/user.dto';

@Exclude()
export class AuthDTO {
  @Expose()
  @Type(() => UserDTO)
  user: UserDTO;

  @Expose()
  @IsString()
  token: string;
}

export class TokenValidType {
  @IsBoolean()
  valid: boolean;
}
