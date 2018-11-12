import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { StatusMonitorController } from './status.monitor.controller';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitoringService } from './status.monitoring.service';
import { StatusMonitorMiddleware } from './status.monitor.middleware';

@Module({
  controllers: [StatusMonitorController],
  providers: [StatusMonitorGateway, StatusMonitoringService],
})
export class StatusMonitorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatusMonitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
