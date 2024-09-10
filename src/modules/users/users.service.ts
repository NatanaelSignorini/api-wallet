import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseInputWhere } from '../bases/dto/base.input';
import { Role } from '../roles/entities/role.entity';
import * as consts from './../../common/constants/error.constants';
import { CreateUserInput } from './dto/create-user.input.dto';
import { CustomUsersDTO } from './dto/custom-users-dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findOne(input: BaseInputWhere & FindOneOptions<User>): Promise<User> {
    const userData = await this.userRepository.findOne({ ...input });
    if (!userData) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }
    return userData;
  }

  async findAllUsers(): Promise<CustomUsersDTO> {
    const userData: UserDTO[] = await this.userRepository.find({
      relations: ['role'],
    });

    const totalCount = await this.userRepository.count();

    return plainToClass(CustomUsersDTO, { nodes: userData, totalCount });
  }

  async getUserById(id: string): Promise<UserDTO> {
    const userData = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!userData) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }

    return plainToClass(UserDTO, userData);
  }

  async createUser(data: CreateUserInput): Promise<UserDTO> {
    const foundUser = await this.userRepository.findOne({
      where: [{ email: data.email, cpfCnpj: data.cpfCnpj }],
    });
    if (foundUser) {
      throw new UnauthorizedException(consts.USER_EXIST);
    }

    const role = await this.roleRepository.findOne({
      where: { name: data.role },
    });

    if (!role) {
      throw new NotFoundException(consts.ROLE_NOT_FOUND);
    }

    const user: User = this.userRepository.create({
      ...data,
      role,
    });

    const userSaved = await this.userRepository.save(user);
    if (!userSaved) {
      throw new InternalServerErrorException(
        'Problem to create a User. Try again',
      );
    }
    return plainToClass(UserDTO, userSaved);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDTO> {
    const foundUser: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }

    const role = await this.roleRepository.findOne({
      where: { name: data.role },
    });

    if (!role) {
      throw new NotFoundException(consts.ROLE_NOT_FOUND);
    }

    const buildUser: User = this.userRepository.create({
      ...data,
      role: role,
    });

    const userSaved = await this.userRepository.save({
      ...foundUser,
      ...buildUser,
    });

    if (!userSaved) {
      throw new InternalServerErrorException(
        'Problem to update a User. Try again',
      );
    }

    return plainToClass(UserDTO, userSaved);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    const deleted = await this.userRepository.softDelete(user.id);
    if (deleted) {
      return true;
    }
    return false;
  }

  async updateLastLogin(id: string): Promise<User> {
    const foundUser: User = await this.userRepository.findOne({
      where: { id },
    });

    if (!foundUser) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }
    delete foundUser.password;
    foundUser.lastLogin = new Date();

    const userSaved = await this.userRepository.save(foundUser);

    return userSaved;
  }
}
