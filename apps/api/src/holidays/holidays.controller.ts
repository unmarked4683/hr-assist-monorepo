import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HolidayService } from './holiday.service';

@Controller('holidays')
@UseGuards(JwtAuthGuard)
export class HolidaysController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  findAll() {
    return this.holidayService.findAll();
  }

  @Post('sync')
  sync() {
    return this.holidayService.syncStatutoryHolidays();
  }
}
