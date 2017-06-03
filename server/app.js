'use strict'

import 'dotenv/config'
var SwaggerExpress = require('swagger-express-mw')
var SwaggerUi = require('swagger-tools/middleware/swagger-ui')
var express = require('express')
var app = express()
module.exports = app // for testing

var config = {
  configDir: `${__dirname}/config`, // move the config file
  swaggerFile: `${__dirname}/api/swagger/swagger.yaml`, // move the swagger spec file
  appRoot: __dirname // required config
}

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err
  }

  // install middleware
  swaggerExpress.register(app)
  app.use(SwaggerUi(swaggerExpress.runner.swagger))
  app.use(express.static('front-end'))
  var port = process.env.PORT || 8080
  app.listen(port)

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(
      'try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott'
    )
  }
})
