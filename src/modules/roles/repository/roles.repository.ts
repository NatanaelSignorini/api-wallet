import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesRepository extends Repository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource.manager);
  }

  async findByName(name: string): Promise<Role> {
    return this.findOne({ where: { name } });
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return this.find({
      where: names.map((name) => ({ name })),
    });
  }
}
