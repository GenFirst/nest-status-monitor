import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/core';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

export class StatusMonitorModule {
  public static setup(endpointPath: string, app: INestApplication) {
    const validatePath = (path): string =>
      path.charAt(0) !== '/' ? '/' + path : path;

    const httpServer = app.getHttpServer();
    if (httpServer instanceof FastifyAdapter) {
      return this.setupFastify(endpointPath, httpServer);
    }

    const finalPath = validatePath(endpointPath);

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

    app.use(finalPath, (req, res) => res.send(render(data)));
  }

  private static setupFastify(path: string, httpServer: FastifyAdapter) {
    httpServer.register(loadPackage('fastify-swagger', 'StatusMonitorModule'), {
      exposeRoute: true,
      routePrefix: path,
      mode: 'static',
    });
  }
}
