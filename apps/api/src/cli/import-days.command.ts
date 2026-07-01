import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { HolidayService } from '../holidays/holiday.service';

interface ImportDaysOptions {
  years?: string;
}

@Command({
  name: 'import-days',
  description: 'Import statutory holidays from the external Nager.Date API',
})
export class ImportDaysCommand extends CommandRunner {
  private readonly logger = new Logger(ImportDaysCommand.name);

  constructor(private readonly holidayService: HolidayService) {
    super();
  }

  async run(_passedParams: string[], options: ImportDaysOptions): Promise<void> {
    const years = options.years
      ? options.years.split(',').map((value) => Number.parseInt(value.trim(), 10))
      : undefined;

    if (years?.some((year) => Number.isNaN(year))) {
      throw new Error('Invalid --years value. Expected comma-separated numbers, e.g. 2026,2027');
    }

    const result = await this.holidayService.syncStatutoryHolidays(years);
    this.logger.log(
      `Imported ${result.syncedCount} statutory holidays for years: ${result.years.join(', ')}`,
    );
  }

  @Option({
    flags: '-y, --years <years>',
    description: 'Comma-separated years to import (default: current and next year)',
  })
  parseYears(value: string): string {
    return value;
  }
}
