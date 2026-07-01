import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HolidaysModule } from './holidays/holidays.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    CommonModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    HolidaysModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
