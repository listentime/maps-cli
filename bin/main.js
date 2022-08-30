#! /usr/bin/env node
const { program } = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols');
const { version } = require('../package.json')
const init = require('../src/init')
program.command('init').description('初始化项目').action(async () => {
  console.log('接受参数',process.argv)
  // 默认初始化命令需要传入模版名称，项目名称两个参数
  if (!process.argv.slice(3).length) {
    console.log(logSymbols.error, chalk.red('缺少参数'))
  } else {
    // 执行初始化代码
    await init(process.argv.slice(3))
  }
})
program.command('ir').description('初始化项目').action(async () => {
  console.log('接受参数',process.argv)
  // 默认初始化命令需要传入模版名称，项目名称两个参数
  if (!process.argv.slice(3).length) {
    console.log(logSymbols.error, chalk.red('缺少参数'))
  } else {
    // 执行初始化代码
    await init(process.argv.slice(3))
  }
})
program.usage('<command> [options]')
program.version(version, '-V --version').parse(process.argv)
