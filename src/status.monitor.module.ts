import { Module } from '@nestjs/common';
import { StatusMonitorController } from './status.monitor.controller';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitoringService } from './status.monitoring.service';

@Module({
  controllers: [StatusMonitorController],
  providers: [StatusMonitorGateway, StatusMonitoringService],
})
export class StatusMonitorModule {}
