import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async findOneUser(options: any): Promise<User> {
    const user = await this.findOne({ ...options });
    return user;
  }

  async findAllUsersWithRole(): Promise<[User[], number]> {
    const users = await this.find({ relations: ['role'] });
    const totalCount = await this.count();
    return [users, totalCount];
  }

  async findUserById(id: string): Promise<User> {
    return this.findOne({ where: { id }, relations: ['role'] });
  }

  async findUserByEmailOrCpf(email: string, cpfCnpj: string): Promise<User> {
    return this.findOne({
      where: [{ email, cpfCnpj }],
    });
  }

  async saveUser(user: User): Promise<User> {
    return this.save(user);
  }

  async softDeleteUser(id: string): Promise<boolean> {
    const result = await this.softDelete(id);
    return result.affected > 0;
  }

  async updateLastLogin(user: User): Promise<User> {
    user.lastLogin = new Date();
    return this.save(user);
  }
}
