import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthInput {
  @ApiProperty({
    description: 'Email Input',
    example: 'email@email.com',
  })
  @IsEmail({}, { message: 'Non-standard email' })
  email: string;

  @ApiProperty({
    description: 'Password Input',
    example: '1234@abcd',
  })
  @IsString()
  password: string;
}
