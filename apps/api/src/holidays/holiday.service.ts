import {
  DAY_TYPES,
  isValidDayTypeCode,
  type DayOff,
  type HolidaySyncResult,
  type IsoDate,
} from '@hr-assist/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { Env } from '../config/env.schema';

interface NagerHoliday {
  date: string;
  name: string;
  countryCode: string;
  nationalHoliday: boolean;
}

@Injectable()
export class HolidayService {
  private readonly logger = new Logger(HolidayService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Cron('0 2 * * *')
  async handleScheduledSync(): Promise<void> {
    try {
      const result = await this.syncStatutoryHolidays();
      this.logger.log(
        `Scheduled holiday sync completed (${result.syncedCount} records, years: ${result.years.join(', ')})`,
      );
    } catch (error) {
      this.logger.error('Scheduled holiday sync failed', error);
    }
  }

  async findAll(): Promise<DayOff[]> {
    const records = await this.prisma.dayOff.findMany({
      orderBy: { date: 'asc' },
    });

    return records.map((record) => this.toDayOffDto(record));
  }

  async syncStatutoryHolidays(years?: number[]): Promise<HolidaySyncResult> {
    const targetYears = years ?? this.getDefaultSyncYears();
    const countryCode = this.configService.get('HOLIDAY_COUNTRY_CODE', {
      infer: true,
    });
    const apiBaseUrl = this.configService.get('HOLIDAY_API_BASE_URL', {
      infer: true,
    });

    let syncedCount = 0;

    for (const year of targetYears) {
      const holidays = await this.fetchStatutoryHolidays(
        apiBaseUrl,
        countryCode,
        year,
      );

      for (const holiday of holidays) {
        await this.upsertStatutoryHoliday(holiday);
        syncedCount += 1;
      }
    }

    return { syncedCount, years: targetYears };
  }

  private getDefaultSyncYears(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1];
  }

  private async fetchStatutoryHolidays(
    apiBaseUrl: string,
    countryCode: string,
    year: number,
  ): Promise<NagerHoliday[]> {
    const url = `${apiBaseUrl}/Holidays/${countryCode}/${year}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Holiday API request failed (${response.status}) for year ${year}`,
      );
    }

    const payload = (await response.json()) as NagerHoliday[];

    if (!Array.isArray(payload)) {
      throw new Error(`Holiday API returned invalid payload for year ${year}`);
    }

    return payload.filter((holiday) => holiday.nationalHoliday);
  }

  private async upsertStatutoryHoliday(holiday: NagerHoliday): Promise<void> {
    const date = this.parseHolidayDate(holiday.date);

    await this.prisma.dayOff.upsert({
      where: { date },
      create: {
        date,
        name: holiday.name,
        typeCode: DAY_TYPES.STATUTORY,
      },
      update: {
        name: holiday.name,
        typeCode: DAY_TYPES.STATUTORY,
      },
    });
  }

  private parseHolidayDate(isoDate: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      throw new Error(`Invalid holiday date format: ${isoDate}`);
    }

    return new Date(`${isoDate}T00:00:00.000Z`);
  }

  private toDayOffDto(record: {
    id: string;
    date: Date;
    name: string;
    typeCode: number;
  }): DayOff {
    if (!isValidDayTypeCode(record.typeCode)) {
      throw new Error(`Invalid day type code: ${record.typeCode}`);
    }

    return {
      id: record.id,
      date: record.date.toISOString().slice(0, 10) as IsoDate,
      name: record.name,
      typeCode: record.typeCode,
    };
  }
}
