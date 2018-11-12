import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusMonitorModule } from '../../../dist/status.monitor.module';
import { HealtController } from './healtController';

@Module({
  imports: [StatusMonitorModule],
  controllers: [AppController, HealtController],
  providers: [AppService],
})
export class AppModule {}
