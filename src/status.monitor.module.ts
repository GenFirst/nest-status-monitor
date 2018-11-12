import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { StatusMonitorController } from './status.monitor.controller';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitoringService } from './status.monitoring.service';
import { StatusMonitorMiddleware } from './status.monitor.middleware';
import { HealtCheckService } from './healt.check.service';

@Module({
  controllers: [StatusMonitorController],
  providers: [StatusMonitorGateway, StatusMonitoringService, HealtCheckService],
})
export class StatusMonitorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatusMonitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
