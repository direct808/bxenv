/*
 проверить порты для httpd и mysql
 Актуализировать конфиги сервера
 Актуализировать конфиги bitrix
 */


var exec = require('child_process').exec;
var fs = require('fs');
var execSync = require('child_process').execSync;
var path = require('path');
var portscanner = require('portscanner');
var p = require('./common/path');
var httpdConf = require('./common/httpdconf');
var ini = require('./common/ini');
var opener = require("opener");

var MYSQL_PORT = 0;


portscanner.findAPortNotInUse(3000, 4000, '127.0.0.1', function (error, port) {
    console.log('AVAILABLE PORT for httpd AT: ' + port)
    runHttpd(port);
});

portscanner.findAPortNotInUse(3306, 3406, '127.0.0.1', function (error, port) {
    console.log('AVAILABLE PORT for mysql AT: ' + port)
    runMysql(port);
});

process.on('SIGINT', exitHandler);

function exitHandler() {
    console.info('Stopping mysql...');
    stopMysql();
}


function runHttpd(port) {
    httpdConf.write(p.work_httpdconf, {
        BXENVDIR: p.bxenv,
        WORKDIR: p.work,
        SRVROOT: p.bxenv_phpDir,
        PORT: port,
        BXENV_PHP_MODULE_PATH: p.bxenv_phpModule,
    });

    let cmd = [
        p.bxenv_httpd,
        '-f "' + p.work_httpdconf + '"',
    ];
    exec(cmd.join(' '), function (error, stdout, stderr) {
        if (error)
            console.log(error.toString(), stderr);
    });

    opener("http://localhost:" + port);
}


function runMysql(port) {
    MYSQL_PORT = port;
    ini.write(p.work_mysqlini, {
        datadir: path.resolve(p.work_mysqldata).replace(/\\/g, "/"),
        port: port
    });

    var cmd = [
        p.bxenv_mysqld,
        '--defaults-file="' + p.work_mysqlini + '"',
        // `--log-error="${logPath}"`
    ];
    return exec(cmd.join(" "), function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });
}

function stopMysql() {
    let cmd = [
        p.bxenv_mysqladmin,
        '-u root',
        'shutdown',
        '-P ' + MYSQL_PORT
    ];

    exec(cmd.join(' '), function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });
}