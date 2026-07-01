import { Module } from '@nestjs/common';
import { HolidaysController } from './holidays.controller';
import { HolidayService } from './holiday.service';

@Module({
  controllers: [HolidaysController],
  providers: [HolidayService],
  exports: [HolidayService],
})
export class HolidaysModule {}
