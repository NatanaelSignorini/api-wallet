import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseInputWhere } from '../bases/dto/base.input';
import * as consts from './../../common/constants/error.constants';
import { CreateUserInput } from './dto/create-user.input.dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { UserDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    public userRepository: Repository<Users>,
  ) {}

  async findOne(input: BaseInputWhere & FindOneOptions<Users>): Promise<Users> {
    const data = await this.userRepository.findOne({ ...input });
    if (!data) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }
    return data;
  }

  async findAllUsers(): Promise<UserDTO[]> {
    const userData: UserDTO[] = await this.userRepository.find();

    const userDTO: UserDTO[] = userData.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      email: user.email,
      lastLogin: user.lastLogin,
    }));
    return userDTO;
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      email: user.email,
      lastLogin: user.lastLogin,
    };
  }

  async createUser(data: CreateUserInput): Promise<UserDTO> {
    const foundUser = await this.userRepository.findOne({
      where: [{ email: data.email }],
    });
    if (foundUser) {
      throw new UnauthorizedException(consts.USER_EXIST);
    }
    const user: Users = this.userRepository.create({
      ...data,
      // roles: data.roles,
    });
    const userSaved = await this.userRepository.save(user);
    if (!userSaved) {
      throw new InternalServerErrorException(
        'Problem to create a User. Try again',
      );
    }

    return {
      id: userSaved.id,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      deletedAt: userSaved.deletedAt,
      email: userSaved.email,
      lastLogin: userSaved.lastLogin,
    };
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDTO> {
    const foundUser: Users = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new NotFoundException(consts.USER_NOT_FOUND);
    }

    const buildUser: Users = this.userRepository.create(data);

    const userSaved = await this.userRepository.save({
      ...foundUser,
      ...buildUser,
    });

    return {
      id: userSaved.id,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      deletedAt: userSaved.deletedAt,
      email: userSaved.email,
      lastLogin: userSaved.lastLogin,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    const deleted = await this.userRepository.softDelete(user.id);
    if (deleted) {
      return true;
    }
    return false;
  }

  async updateLastLogin(id: string): Promise<Users> {
    const foundUser: Users = await this.userRepository.findOne({
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
