import { Get, Controller, HttpCode } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

const controllerPath = 'monitor';

@Controller(controllerPath)
export class StatusMonitorController {
  data;
  render;

  constructor() {
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
  root() {
    return this.render(this.data);
  }
}
