import { Get, Controller, HttpCode, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { HealthCheckService } from './health.check.service';
import { PATH_METADATA } from '@nestjs/common/constants';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';

@Controller()
export class StatusMonitorController {
  data;
  render;

  constructor(
    private readonly healtCheckService: HealthCheckService,
    @Inject(STATUS_MONITOR_OPTIONS_PROVIDER) config: StatusMonitorConfiguration,
  ) {
    const bodyClasses = Object.keys(config.chartVisibility)
      .reduce((accumulator, key) => {
        if (config.chartVisibility[key] === false) {
          accumulator.push(`hide-${key}`);
        }
        return accumulator;
      }, [])
      .join(' ');

    this.data = {
      title: config.pageTitle,
      port: config.port,
      namespace: process.env.STATUS_MONITOR_WS_NAMESPACE || '',
      bodyClasses: bodyClasses,
      script: fs.readFileSync(
        path.join(__dirname, '../src/public/javascripts/app.js'),
      ),
      style: fs.readFileSync(
        path.join(__dirname, '../src/public/stylesheets/style.css'),
      ),
    };

    const htmlTmpl = fs
      .readFileSync(path.join(__dirname, '../src/public/index.html'))
      .toString();

    this.render = Handlebars.compile(htmlTmpl, { strict: true });
  }

  public static forRoot(rootPath: string = 'monitor') {
    Reflect.defineMetadata(PATH_METADATA, rootPath, StatusMonitorController);
    return StatusMonitorController;
  }

  @Get()
  @HttpCode(200)
  async root() {
    const healtData = await this.healtCheckService.checkAllEndpoints();
    this.data.healthCheckResults = healtData;
    return this.render(this.data);
  }
}
