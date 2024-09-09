import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserInput {
  @ApiProperty({
    description: 'Email User',
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
}
