import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as pidusage from 'pidusage';
import * as os from 'os';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';

@Injectable()
export class StatusMonitoringService {
  spans = [];

  constructor(
    @Inject(forwardRef(() => StatusMonitorGateway))
    private readonly statusMonitorWs: StatusMonitorGateway,
    @Inject(STATUS_MONITOR_OPTIONS_PROVIDER)
    readonly config: StatusMonitorConfiguration,
  ) {
    config.spans.forEach(currentSpan => {
      const span = {
        os: [],
        responses: [],
        interval: currentSpan.interval,
        retention: currentSpan.retention,
      };

      this.spans.push(span);

      const interval = setInterval(() => {
        this.collectOsMetrics(span);
        this.sendOsMetrics(span);
      }, span.interval * 1000);
      interval.unref(); // don't keep node.js process up
    });
  }

  collectOsMetrics(span) {
    const defaultResponse = {
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      count: 0,
      mean: 0,
      timestamp: Date.now(),
    };

    pidusage.stat(process.pid, (err, stat) => {
      if (err) {
        return;
      }

      const last = span.responses[span.responses.length - 1];

      // Convert from B to MB
      stat.memory = stat.memory / 1024 / 1024;
      stat.load = os.loadavg();
      stat.timestamp = Date.now();

      span.os.push(stat);
      if (
        !span.responses[0] ||
        last.timestamp + span.interval * 1000 < Date.now()
      ) {
        span.responses.push(defaultResponse);
      }

      // todo: I think this check should be moved somewhere else
      if (span.os.length >= span.retention) span.os.shift();
      if (span.responses[0] && span.responses.length > span.retention)
        span.responses.shift();
    });
  }

  sendOsMetrics(span) {
    this.statusMonitorWs.sendMetrics(span);
  }

  getData() {
    return this.spans;
  }

  collectResponseTime(statusCode, startTime) {
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;
    const category = Math.floor(statusCode / 100);

    this.spans.forEach(span => {
      const last = span.responses[span.responses.length - 1];

      if (
        last !== undefined &&
        last.timestamp / 1000 + span.interval > Date.now() / 1000
      ) {
        last[category] += 1;
        last.count += 1;
        last.mean += (responseTime - last.mean) / last.count;
      } else {
        span.responses.push({
          2: category === 2 ? 1 : 0,
          3: category === 3 ? 1 : 0,
          4: category === 4 ? 1 : 0,
          5: category === 5 ? 1 : 0,
          count: 1,
          mean: responseTime,
          timestamp: Date.now(),
        });
      }
    });
  }
}
