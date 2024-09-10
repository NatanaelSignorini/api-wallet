import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesEnum } from 'src/modules/roles/enum/role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const users = [{ name: 'Admin', email: 'admin@email.com', password: 'admin' }];

export class SeedUsers1725919707672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const UserRepo = queryRunner.connection.getRepository(User);
    const RoleRepo = queryRunner.connection.getRepository(Role);

    const adminRole = await RoleRepo.findOne({
      where: { name: RolesEnum.ADMIN },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    await Promise.all(
      users.map(async (user) => {
        const existingUser = await UserRepo.findOne({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = UserRepo.create({
            fullName: user.name,
            email: user.email,
            password: user.password,
            role: adminRole,
          });
          await UserRepo.save(newUser);
        }
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const UserRepo = queryRunner.connection.getRepository(User);
    await UserRepo.delete({ email: 'admin@email.com' });
  }
}
