import { Module } from '@nestjs/common';
import { StatusMonitorController } from './status.monitor.controller';

@Module({
  controllers: [StatusMonitorController],
})
export class StatusMonitorModule {}
