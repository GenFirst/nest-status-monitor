import { Get, Controller, HttpCode } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { HealtCheckService } from './healt.check.service';

const controllerPath = 'monitor';

@Controller(controllerPath)
export class StatusMonitorController {
  data;
  render;

  constructor(private readonly healtCheckService: HealtCheckService) {
    this.data = {
      title: 'Nest.js Status',
      port: 3001,
      bodyClasses: '',
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

  @Get()
  @HttpCode(200)
  async root() {
    const healtData = await this.healtCheckService.checkAllEndpoints();
    this.data.healthCheckResults = healtData;
    return this.render(this.data);
  }
}
