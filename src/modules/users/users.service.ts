import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DataSource } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { WalletsService } from '../wallets/wallets.service';
import * as consts from './../../common/constants/error.constants';
import { CreateUserInput } from './dto/create-user.input.dto';
import { CustomUsersDTO } from './dto/custom-users-dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repository/users.respository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly walletsService: WalletsService,
    private readonly dataSource: DataSource,
  ) {}

  async findOneUser(options: any): Promise<User> {
    const userData = await this.usersRepository.findOneUser(options);
    return userData;
  }

  async findAllUsers(): Promise<CustomUsersDTO> {
    const [users, totalCount] =
      await this.usersRepository.findAllUsersWithRole();
    return plainToClass(CustomUsersDTO, { nodes: users, totalCount });
  }

  async getUserById(id: string): Promise<UserDTO> {
    const userData = await this.usersRepository.findUserById(id);
    if (!userData) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }
    return plainToClass(UserDTO, userData);
  }

  async createUser(data: CreateUserInput): Promise<UserDTO> {
    const foundUser = await this.usersRepository.findUserByEmailOrCpf(
      data.email,
      data.cpfCnpj,
    );
    if (foundUser) {
      throw new UnauthorizedException(consts.USER_EXIST);
    }

    const role = await this.rolesService.findByName(data.role);
    if (!role) {
      throw new NotFoundException(consts.ROLE_NOT_FOUND);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = this.usersRepository.create({
        ...data,
        role,
      });

      const userSaved = await queryRunner.manager.save(user);
      if (!userSaved) {
        throw new InternalServerErrorException(
          'Problem to create a User. Try again',
        );
      }

      const walletCreate = await this.walletsService.createWalletByUserId(
        userSaved.id,
      );
      if (!walletCreate) {
        throw new InternalServerErrorException(
          'Problem to create a Wallet. Try again',
        );
      }

      await queryRunner.commitTransaction();

      return plainToClass(UserDTO, userSaved);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDTO> {
    const foundUser: User = await this.usersRepository.findUserById(id);
    if (!foundUser) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }

    const role = await this.rolesService.findByName(data.role);
    if (!role) {
      throw new NotFoundException(consts.ROLE_NOT_FOUND);
    }

    const updatedUser: User = this.usersRepository.create({
      ...foundUser,
      ...data,
      role,
    });

    const userSaved = await this.usersRepository.saveUser(updatedUser);
    if (!userSaved) {
      throw new InternalServerErrorException(
        'Problem to update a User. Try again',
      );
    }

    return plainToClass(UserDTO, userSaved);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.softDeleteUser(id);
  }

  async updateLastLogin(id: string): Promise<User> {
    const foundUser: User = await this.usersRepository.findUserById(id);
    if (!foundUser) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }

    return this.usersRepository.updateLastLogin(foundUser);
  }
}
