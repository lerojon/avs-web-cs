'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://172.27.28.196:19090/setting"'//'"http://10.30.44.72:9090/setting"'//http://172.27.28.196:19090/setting'"http://10.30.44.73:3000/mock/14"'
   
})
