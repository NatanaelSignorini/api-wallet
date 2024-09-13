import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/auth.roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesEnum } from '../roles/enum/role.enum';
import { CreateUserInput } from './dto/create-user.input.dto';
import { CustomUsersDTO } from './dto/custom-users-dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get Users All' })
  @ApiResponse({
    status: 200,
    description: 'Get Users All',
    type: CustomUsersDTO,
  })
  async getUsersAll(): Promise<CustomUsersDTO> {
    return await this.usersService.findAllUsers();
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get User for id' })
  @ApiResponse({
    status: 200,
    description: 'Get User',
    type: UserDTO,
  })
  async getUserById(@Body('id') id: string): Promise<UserDTO> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'Create User',
    type: UserDTO,
  })
  async createUser(@Body() data: CreateUserInput): Promise<UserDTO> {
    return this.usersService.createUser(data);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({
    status: 201,
    description: 'Update User',
    type: UserDTO,
  })
  async updateUser(
    @Body('id') id: string,
    @Body() data: UpdateUserInput,
  ): Promise<UserDTO> {
    return this.usersService.updateUser(id, data);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({
    status: 201,
    description: 'Delete User',
    type: 'boolean',
  })
  async deleteUser(@Body('id') id: string): Promise<boolean> {
    const deleted = await this.usersService.deleteUser(id);
    return deleted;
  }
}
