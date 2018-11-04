import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StatusMonitorModule } from '../../../dist/status.monitor.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  StatusMonitorModule.setup('/monitor', app);
  await app.listen(3000);
}
bootstrap();
