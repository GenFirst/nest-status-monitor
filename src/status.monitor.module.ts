import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  DynamicModule,
} from '@nestjs/common';
import { StatusMonitorController } from './status.monitor.controller';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitoringService } from './status.monitoring.service';
import { StatusMonitorMiddleware } from './status.monitor.middleware';
import { HealthCheckService } from './health.check.service';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';

@Module({
  controllers: [StatusMonitorController.forRoot('monitor')],
  providers: [
    StatusMonitorGateway,
    StatusMonitoringService,
    HealthCheckService,
  ],
})
export class StatusMonitorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatusMonitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  static setUp(config: StatusMonitorConfiguration): DynamicModule {
    return {
      module: StatusMonitorModule,
      providers: [
        {
          provide: STATUS_MONITOR_OPTIONS_PROVIDER,
          useValue: config,
        },
        StatusMonitorGateway,
        StatusMonitoringService,
        HealthCheckService,
      ],
      controllers: [StatusMonitorController.forRoot(config.path)],
    };
  }
}
