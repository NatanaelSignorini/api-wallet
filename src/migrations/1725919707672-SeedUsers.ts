import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesEnum } from 'src/modules/roles/enum/role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const users = [{ name: 'Admin' }];

export class SeedUsers1725919707672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      users.map(async (user) => {
        const UserRepo = queryRunner.connection.getRepository(User);
        const admin = UserRepo.create({
          fullName: user.name,
          email: `${user.name.toLowerCase().replace(' ', '.')}@email.com`,
          password: user.name.toLowerCase().replace(' ', '.'),
        });
        const RoleRepo = queryRunner.connection.getRepository(Role);
        admin.roles = await RoleRepo.find({ where: { name: RolesEnum.ADMIN } });
        await UserRepo.save(admin);
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const UserRepo = queryRunner.connection.getRepository(User);
    await UserRepo.delete({ email: 'admin@brainny.cc' });
  }
}
