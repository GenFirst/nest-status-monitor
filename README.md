# nest-status-monitor

[![NPM](https://nodei.co/npm/nest-status-monitor.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nest-status-monitor/)

[![nest-status-monitor on npm](https://img.shields.io/npm/v/nest-status-monitor.svg)](https://www.npmjs.com/package/nest-status-monitor)
[![npm](https://img.shields.io/npm/dt/nest-status-monitor.svg)](https://img.shields.io/npm/dt/nest-status-monitor.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Simple, self-hosted module based on Socket.io and Chart.js to report realtime
server metrics for Nest.js based node servers.

## Installation & setup

1. Run `npm install nest-status-monitor --save`
2. Setup module:

```javascript
@Module({
  imports: [StatusMonitorModule.setUp(statusMonitorConfig)],
```

3. Run server and go to `/status`

## Run examples

1. Go to `cd examples/test-status-monitor`
2. Run `npm i`
3. Run server `npm start`
4. Go to `http://localhost:3001`

## Options

Monitor can be configured by passing options object during initialization of
module.

Default config:

```javascript
title: 'Nest.js Status Monitor',  // Default title
path: '/status',
spans: [{
  interval: 1,            // Every second
  retention: 60           // Keep 60 datapoints in memory
}, {
  interval: 5,            // Every 5 seconds
  retention: 60
}, {
  interval: 15,           // Every 15 seconds
  retention: 60
}],
chartVisibility: {
  cpu: true,
  mem: true,
  load: true,
  responseTime: true,
  rps: true,
  statusCodes: true
},
healthChecks: [],
ignoreStartsWith: '/admin'
```

## Health Checks

You can add a series of health checks to the configuration that will appear
below the other stats. The health check will be considered successful if the
endpoint returns a 200 status code.

```javascript
// config
healthChecks: [{
  protocol: 'http',
  host: 'localhost'
  path: '/healt/alive',
  port: '3001'
}, {
  protocol: 'http',
  host: 'localhost'
  path: '/healt/dead',
  port: '3001'
}]
```

## License

[MIT License](https://opensource.org/licenses/MIT) © Ivan Vasiljevic

Forked from
[express-status-monitor](https://github.com/RafalWilinski/express-status-monitor)
