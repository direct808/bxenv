/*
 - Создать директорию www
 -. помесить туда файлы
 - bitrixsetup.php
 - /bitrix/php_interface/dbconn.php
 - Созать директорию bxenv
 - помесить туда файлы
 httpd.conf
 php.ini
 my.ini

 для файла httpd.conf произвести замены
 BXENVDIR - путь к директории модуля
 WORKDIR  - путь к директории проекта
 SRVROOT  - путь к директории httpd
 PORT     - потр web сервера

 для файла php.ini произвести замены
 extension_dir = "Путь к модулю php\ext"

 для файла my.ini произвести замены
 datadir = путь к директории проекта /bxenv/data
 port    = свободный порт для mysql

 инициализировать базу данных в директории проекта bxenv/data
 создать
 */

var httpdconf = require('./httpdconf');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var copyDir = require('copy-dir').sync;
var mkDir = require('mkdirp').sync;
var dirExists = require('@justinc/dir-exists').dirExistsSync;
var p = require('./path');
var ini = require('./ini');
var console = require('better-console');
var execPromise = require('./common/exec-promise');
// var timers = require('timers')

// console.info('111111111');

// process.stdout.write("weqweqwe");
// process.stdout.write("weqweqwe");
// // console.info(process.stdin);
// process.exit();

console.time('Total time');

// console.log = function (str) {
//     process.stdout.write(str);
// };


// const workDir = process.cwd();
// const workConfigDir = path.resolve(workDir + '/bxenv');
// const workWwwDir = path.resolve(workDir + '/www');


if (!dirExists(p.work_configDir)) {
    console.log('Created directory ' + p.work_configDir + '...');
    mkDir(p.work_configDir);
    console.info('OK');

}

console.log('Copy files to ' + p.work_configDir + '...');
copyDir(p.bxenv_configDir, p.work_configDir);
console.info('OK');


if (!dirExists(p.work_wwwDir)) {
    console.log('Create directory ' + p.work_wwwDir + '...');
    mkDir(p.work_wwwDir);
    console.info('OK');


    console.log('Copy files to ' + p.work_wwwDir + '...');
    copyDir(p.bxenv_wwwDir, p.work_wwwDir);
    console.info('OK');
}


console.log('Write to ' + p.work_httpdconf + '...');
httpdconf.write(p.work_httpdconf, {
    BXENVDIR: p.bxenv,
    WORKDIR: p.work,
    SRVROOT: p.bxenv_phpDir,
    PORT: 80,
    BXENV_PHP_MODULE_PATH: p.bxenv_phpModule,
});
console.info('OK');


console.log('Write to ' + p.work_phpini + '...');
ini.write(p.work_phpini, {
    extension_dir: p.bxenv_phpExtDir
});
console.info('OK');


console.log('Write to ' + p.work_mysqlini + '...');
ini.write(p.work_mysqlini, {
    datadir: path.resolve(p.work_mysqldata).replace(/\\/g,"/"),
    port: 3306
});
console.info('OK');

// var data = iniBuilder.parse(fs.readFileSync(workConfigDir + '/my.ini'));
// iniBuilder.find(data, 'datadir').value = path.resolve(workDir + '/bxenv/data');
// iniBuilder.find(data, 'port').value = 3306;
// fs.writeFileSync(workConfigDir + '/my.ini', iniBuilder.serialize(data));


var cmd = [
    p.bxenv_mysqld,
    '--defaults-file="' + p.work_mysqlini+'"',
    '--datadir="' + p.work_mysqldata+'"',
    '--initialize-insecure',
    // '--console',
];

if (dirExists(p.work_mysqldata)) {
    console.warn('\nDirectory "' + p.work_mysqldata + '" is not empty ');
    process.exit(1);
}

console.log('Create mysql database data...');
execSync(cmd.join(' '));
console.info('OK');
console.timeEnd('Total time');
