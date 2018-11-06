import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusMonitorModule } from '../../../dist/status.monitor.module';

@Module({
  imports: [StatusMonitorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
