var spawn = require('child_process').spawn;
var fs = require('fs');

var console = require('better-console');
var path = require('path');
var findAPortNotInUse = require('portscanner').findAPortNotInUse;
var opener = require("opener");
var fileExists = require('file-exists');


function httpConf(cwd, name, value) {
    var f = cwd + '/bxenv/httpd.conf';
    var content = fs.readFileSync(f).toString();
    var reg = new RegExp('(Define\\s+' + name + '\\s+\\"?)(.*?)(\\"?)$', 'gim');
    if (value) {
        content = content.replace(reg, '$1' + value + '$3');
        fs.writeFileSync(f, content);
    } else {
        var m = reg.exec(content);
        return m ? m[2] : null;
    }
    return true;
}

function iniConf(file, name, value) {
    var content = fs.readFileSync(file).toString();
    var reg = new RegExp('(' + name + '\\s?\\=\\s?\\"?)(.*?)(\\"?)$', 'gim');

    if (value) {
        content = content.replace(reg, '$1' + value + '$3');
        fs.writeFileSync(file, content);
    } else {
        let m = reg.exec(content);
        return m ? m[2] : null;
    }
    return true;
}

function writeToDbconn(cwd, port) {
    var f = cwd + '/www/bitrix/php_interface/dbconn.php';
    if (!fileExists(f))
        return;
    var content = fs.readFileSync(f).toString();
    content = content.replace(/\$DBHost\s?\=\s?"(.*)"/gim, "$DBHost = \"127.0.0.1:" + port + "\"");
    fs.writeFileSync(f, content);
}

function writeToSettings(cwd, port) {
    var f = cwd + '/www/bitrix/.settings.php';
    if (!fileExists(f))
        return;
    var content = fs.readFileSync(f).toString();
    content = content.replace(/'host'\s?=>\s?'(.*)'/gim, "'host' => '127.0.0.1:" + port + "'");
    fs.writeFileSync(f, content);
}


module.exports = function () {
    var cwd = process.cwd();
    var httpPort = httpConf(cwd, 'BXENV_PORT');
    var mysqlPort = iniConf(cwd + '/bxenv/my.ini', 'port');
    console.info('Current httpd port: ', httpPort);
    console.info('Current mysql port: ', mysqlPort);

    findAPortNotInUse(httpPort, httpPort + 100, '127.0.0.1', function (error, port) {
        console.info('AVAILABLE PORT for httpd AT: ' + port);
        httpConf(cwd, 'BXENV_PORT', port);
        runHttpd(cwd, port);
    });
    findAPortNotInUse(mysqlPort, mysqlPort + 100, '127.0.0.1', function (error, port) {
        console.info('AVAILABLE PORT for mysql AT: ' + port);
        iniConf(cwd + '/bxenv/my.ini', 'port', port);
        writeToDbconn(cwd, port);
        writeToSettings(cwd, port);
        runMysql(cwd, port);

        process.on('SIGINT', ()=>stopMysql(port));
    });

};


function runHttpd(cwd, port) {
    var httpd = path.resolve(__dirname + '/../server/httpd-2.4.23-x86-vc14/bin/httpd.exe');
    var httpdConf = path.resolve(cwd + '/bxenv/httpd.conf');

    let args = ['-f', httpdConf];
    var cmd = spawn(httpd, args);
    console.log(httpd+ ' -f ' + httpdConf);

    cmd.stderr.on('data', (data) => {
        throw Error(data);
    });
    setTimeout(function () {
        opener("http://localhost:" + port);
    }, 1000);
}


function runMysql(cwd) {
    var mysqld = path.resolve(__dirname + '/../server/mysql-5.7.14-win32/bin/mysqld.exe');
    var myini = path.resolve(cwd + '/bxenv/my.ini');
    myini = myini.replace(/\\/g, '/');

    if (!fileExists(myini))
        throw Error('File not found: ' + myini);

    var args = [
        '--defaults-file=' + myini,
        // '--console'
    ];
    spawn(mysqld, args).stderr.on('data', data=>console.error(data.toString()));
}

function stopMysql(port) {
    console.info('Stopping mysql...');
    var mysqladmin = path.resolve(__dirname + '/../server/mysql-5.7.14-win32/bin/mysqladmin.exe');
    let args = [
        '-u',
        'root',
        'shutdown',
        '-P',
        port
    ];
    spawn(mysqladmin, args).stderr.on('data', data=>console.error(data.toString()));
}