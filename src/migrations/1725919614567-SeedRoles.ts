import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesEnum } from 'src/modules/roles/enum/role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

const ROLES = Object.values(RolesEnum);

export class SeedRoles1725919614567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const RoleRepo = queryRunner.connection.getRepository(Role);
    await RoleRepo.save(ROLES.map((role) => ({ name: role })));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const RoleRepo = queryRunner.connection.getRepository(Role);
    const roles = await RoleRepo.find({
      where: ROLES.map((role) => ({ name: role })),
    });
    RoleRepo.remove(roles);
  }
}
