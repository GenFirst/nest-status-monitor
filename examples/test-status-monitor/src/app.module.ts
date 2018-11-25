import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  StatusMonitorModule,
  StatusMonitorConfiguration,
} from '../../../dist/index';
import { HealtController } from './healtController';

const statusMonitorConfig: StatusMonitorConfiguration = {
  pageTitle: 'Nest.js Monitoring Page',
  port: 3001,
  path: '/status',
  ignoreStartsWith: '/healt/alive',
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/healt/alive',
      port: 3001,
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/healt/dead',
      port: 3001,
    },
  ],
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    },
    {
      interval: 60, // Every 60 seconds
      retention: 600,
    },
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
};

@Module({
  imports: [StatusMonitorModule.setUp(statusMonitorConfig)],
  controllers: [AppController, HealtController],
  providers: [AppService],
})
export class AppModule {}
