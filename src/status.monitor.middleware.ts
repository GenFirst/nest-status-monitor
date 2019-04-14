import {
  Injectable,
  NestMiddleware,
  Inject,
} from '@nestjs/common';
import * as onHeaders from 'on-headers';
import { StatusMonitoringService } from './status.monitoring.service';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';

@Injectable()
export class StatusMonitorMiddleware implements NestMiddleware {
  constructor(
    private readonly statusMonitoringService: StatusMonitoringService,
    @Inject(STATUS_MONITOR_OPTIONS_PROVIDER)
    private readonly config: StatusMonitorConfiguration,
  ) {}

    use(req, res, next: Function) {
        if (
            this.config.ignoreStartsWith &&
            !req.originalUrl.startsWith(this.config.ignoreStartsWith) &&
            !req.originalUrl.startsWith(this.config.path)
        ) {
            const startTime = process.hrtime();
            onHeaders(res, () => {
                this.statusMonitoringService.collectResponseTime(
                    res.statusCode,
                    startTime,
                );
            });
        }

        next();
    }
}
