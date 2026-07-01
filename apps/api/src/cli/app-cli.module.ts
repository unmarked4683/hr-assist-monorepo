import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { HolidaysModule } from '../holidays/holidays.module';
import { ImportDaysCommand } from './import-days.command';

@Module({
  imports: [ConfigModule, DatabaseModule, HolidaysModule],
  providers: [ImportDaysCommand],
})
export class AppCliModule {}
