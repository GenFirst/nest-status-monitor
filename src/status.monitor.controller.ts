import { Get, Controller, HttpCode } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

const controllerPath = 'monitor';

@Controller(controllerPath)
export class StatusMonitorController {
  @Get()
  @HttpCode(200)
  root() {
    const data = {
      script: fs.readFileSync(
        path.join(__dirname, '/public/javascripts/app.js'),
      ),
      style: fs.readFileSync(
        path.join(__dirname, '/public/stylesheets/style.css'),
      ),
    };

    const htmlTmpl = fs
      .readFileSync(path.join(__dirname, '/public/index.html'))
      .toString();

    const render = Handlebars.compile(htmlTmpl);
    return render(data);
  }
}
