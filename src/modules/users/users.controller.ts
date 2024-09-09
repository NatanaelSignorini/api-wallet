import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserInput } from './dto/create-user.input.dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { UserDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get Users All' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Users,
  })
  async getUsersAll(): Promise<UserDTO[]> {
    return this.usersService.findAllUsers();
  }

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get User for id' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Users,
  })
  async getUserById(@Param('id') id: string): Promise<UserDTO> {
    return this.usersService.getUserById(id);
  }

  // @Roles('ANY')
  // @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Body() data: CreateUserInput): Promise<UserDTO> {
    return this.usersService.createUser(data);
  }

  // @Roles('ADMIN', 'USER')
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserInput,
  ): Promise<UserDTO> {
    return this.usersService.updateUser(id, data);
  }

  // @Roles('ADMIN', 'USER')
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    const deleted = await this.usersService.deleteUser(id);
    return deleted;
  }
}
