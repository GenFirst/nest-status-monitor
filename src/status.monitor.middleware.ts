import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import * as onHeaders from 'on-headers';
import { StatusMonitoringService } from './status.monitoring.service';

@Injectable()
export class StatusMonitorMiddleware implements NestMiddleware {
  constructor(
    private readonly statusMonitoringService: StatusMonitoringService,
  ) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const startTime = process.hrtime();
      onHeaders(res, () => {
        this.statusMonitoringService.collectResponseTime(
          res.statusCode,
          startTime,
        );
      });
      next();
    };
  }
}
