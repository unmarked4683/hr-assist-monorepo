import { CommandFactory } from 'nest-commander';
import { AppCliModule } from './cli/app-cli.module';

async function bootstrap(): Promise<void> {
  await CommandFactory.run(AppCliModule, {
    logger: ['error', 'warn', 'log'],
  });
}

void bootstrap();
