#!/usr/bin/env node

var bxenv = require('commander');
var pkg = require('../package');
var init = require('../lib/init');
var start = require('../lib/start');
var sendmail = require('../lib/sendmail');

bxenv.version(pkg.version)

bxenv.command('init [php_version]')
    .description('Initialize config and database files in work directory')
    .action(init);

bxenv.command('start')
    .description('Initialize config and database files in work directory')
    .action(start);

bxenv.command('sendmail')
    .description('sendmail for php')
    .action(sendmail);


bxenv.parse(process.argv);

//require('../index');