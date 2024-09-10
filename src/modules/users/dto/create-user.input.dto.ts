import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { RolesEnum } from 'src/modules/roles/enum/role.enum';

export class CreateUserInput {
  @ApiProperty({
    description: 'FullName for User',
    example: 'Fulano de Tal',
  })
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Email for User',
    example: 'email@email.com',
  })
  @IsEmail({}, { message: 'Non-standard email' })
  @IsNotEmpty({ message: 'The Email field cannot be null' })
  email: string;

  @ApiProperty({
    description: 'Password for User',
    example: '1234@abcd',
  })
  @IsNotEmpty({ message: 'The Password field cannot be null' })
  password: string;

  @ApiProperty({
    description: 'CPF or CNPJ for User',
    example: '000.000.000-00 or 00.000.000/0000-00',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'cpfCnpj must be a valid CPF or CNPJ',
  })
  cpfCnpj?: string;

  @ApiProperty({
    enum: RolesEnum,
    example: [RolesEnum.ADMIN, RolesEnum.USER],
  })
  @IsNotEmpty({ message: 'The Role field cannot be null' })
  @IsEnum(RolesEnum, {
    each: true,
    message:
      'roles must be one of the following values: ' +
      Object.values(RolesEnum).join(', '),
  })
  role: RolesEnum;
}

export class CreateUserInputWithoutRole extends OmitType(CreateUserInput, [
  'role',
] as const) {}
