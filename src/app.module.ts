import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresConfig } from './config/postgres.config';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgresConfig,
      // dataSourceFactory: async (options) => {
      //   const dataSource = await new DataSource(options).initialize();
      //   return dataSource;
      // },
    }),

    RolesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
