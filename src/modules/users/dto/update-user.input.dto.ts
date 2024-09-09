import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input.dto';

export class UpdateUserInput extends PartialType(CreateUserInput) {
  @ApiProperty({
    description: 'uuid',
    example: 'c1b899e1-769c-4394-b79a-aeb674ba18f8',
  })
  @IsString({ message: 'The id field cannot be null' })
  @IsNotEmpty({ message: 'The id field cannot be null' })
  id: string;
}
