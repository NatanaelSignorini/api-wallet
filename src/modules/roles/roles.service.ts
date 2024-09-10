import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RolesRepository } from './repository/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findByName(name: string): Promise<Role> {
    return this.rolesRepository.findByName(name);
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return this.rolesRepository.findByNames(names);
  }
}
