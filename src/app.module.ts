import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresConfig } from './config/postgres.config';
import { AuthModule } from './modules/auth/auth.module';
import { EventSourcingModule } from './modules/event-sourcing/event-sourcing.module';
import { RolesModule } from './modules/roles/roles.module';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { winstonConfig } from './config/winston.config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

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
    }),

    // Logger configuration
    WinstonModule.forRoot(winstonConfig),

    AuthModule,
    RolesModule,
    UsersModule,
    TransactionsModule,
    WalletsModule,
    EventSourcingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
