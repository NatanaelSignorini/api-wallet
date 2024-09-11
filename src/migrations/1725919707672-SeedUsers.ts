import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesEnum } from 'src/modules/roles/enum/role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { WalletsService } from 'src/modules/wallets/wallets.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

const users = [
  {
    name: 'Admin',
    email: 'admin@email.com',
    password: 'admin',
    role: RolesEnum.ADMIN,
  },
  {
    name: 'Natanael Signorini',
    email: 'natanaelsignorini@email.com',
    password: '12345678',
    cpfOrCnpj: '484.708.090-40',
    role: RolesEnum.USER,
  },
  {
    name: 'Franciele Faustino',
    email: 'francielefaustino@email.com',
    password: '12345678',
    cpfOrCnpj: '562.404.230-25',
    role: RolesEnum.USER,
  },
  {
    name: 'Roberto Allan',
    email: 'Robertoallan@email.com',
    password: '12345678',
    cpfOrCnpj: '304.451.800-80',
    role: RolesEnum.USER,
  },
  {
    name: 'Amanda Machado',
    email: 'amandomachado@email.com',
    password: '12345678',
    cpfOrCnpj: '929.065.420-16',
    role: RolesEnum.USER,
  },
];

export class SeedUsers1725919707672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const UserRepo = queryRunner.connection.getRepository(User);
    const RoleRepo = queryRunner.connection.getRepository(Role);

    // Criar o contexto da aplicação para acessar os serviços
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const walletsService = appContext.get(WalletsService);

    await Promise.all(
      users.map(async (user) => {
        const existingUser = await UserRepo.findOne({
          where: { email: user.email, cpfCnpj: user.cpfOrCnpj },
        });

        const role = await RoleRepo.findOne({
          where: { name: user.role },
        });

        if (!existingUser) {
          const newUser = UserRepo.create({
            fullName: user.name,
            email: user.email,
            password: user.password,
            cpfCnpj: user.cpfOrCnpj,
            role: role,
          });
          const savedUser = await UserRepo.save(newUser);

          if (savedUser.role?.name === RolesEnum.USER) {
            await walletsService.createWalletByUserId(savedUser.id);
          }
        }
      }),
    );
    await appContext.close();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const UserRepo = queryRunner.connection.getRepository(User);
    await UserRepo.delete({ email: 'admin@email.com' });
  }
}
