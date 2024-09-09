import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    public repository: Repository<Role>,
  ) {}

  async findByName(name: string): Promise<Role> {
    return this.repository.findOne({ where: { name: name } });
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return this.repository.find({
      where: names.map((name) => ({ name })),
    });
  }
}
