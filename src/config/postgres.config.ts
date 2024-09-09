import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  // Método utilizado pelo NestJS
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: +this.configService.get<number>('DB_PORT') || 5432,
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),

      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,

      migrationsRun: false,
      migrations: ['dist/**/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',

      synchronize:
        this.configService.get<string>('DB_SYNC').toLowerCase() == 'true',
      logging:
        this.configService.get<string>('DB_LOGGING').toLowerCase() == 'true',

      extra: { max: 30 },
    };
  }
}

// Criar um DataSource para usar no CLI do TypeORM
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  extra: { max: 30 },
};

export const AppDataSource = new DataSource(dataSourceOptions);
