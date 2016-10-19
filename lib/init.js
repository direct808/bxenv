var execSync = require('child_process').execSync;
var path = require('path');
var fs = require('fs');
var copyDir = require('copy-dir').sync;
var mkdir = require('mkdirp').sync;
var dirExists = require('@justinc/dir-exists').dirExistsSync;
var fileExists = require('file-exists');
var console = require('better-console');

module.exports = init;

function init(php_version) {
    var cwd = process.cwd();

    php_version = php_version || '7';

    if (php_version != '7' && php_version != '56') {
        console.error('Unknown php version: ' + php_version);
        process.exit(1);
    }

    console.time('Total time');

    mkdir(cwd + '/bxenv/mail');

    copyHttpdCong(cwd, php_version);
    copyPhpIni(cwd, php_version);
    copyMyIni(cwd);
    initWWW(cwd);
    initDB(cwd);
}


function copyHttpdCong(cwd, php_version) {
    var dest = cwd + '/bxenv/httpd.conf';
    if (fileExists(dest))
        return;

    var conf = fs.readFileSync(__dirname + '/../config/httpd.conf').toString();

    var php_dir = 'php-7.0.9-Win32-VC14-x86';
    var php_module = 'php7_module';
    var php_module_ext = 'php7apache2_4.dll';

    if (php_version == '56') {
        php_dir = 'php-5.6.25-Win32-VC11-x86';
        php_module = 'php5_module';
        php_module_ext = 'php5apache2_4.dll';
    }

    var serverRoot = path.resolve(__dirname + '/../server/httpd-2.4.23-x86-vc14');

    var php_module_path = path.resolve(__dirname + '/../server/' + php_dir + '/' + php_module_ext);

    conf = conf.replace(/#SERVER_ROOT#/g, serverRoot);
    conf = conf.replace(/#BXENV_PROJECT_PATH#/g, cwd);
    conf = conf.replace(/#PHP_MODULE#/g, php_module + ' "' + php_module_path + '\"');

    fs.writeFileSync(dest, conf);
}

function copyPhpIni(cwd, php_version) {
    var dest = cwd + '/bxenv/php.ini';
    var sendMailpath = 'node "'+path.resolve(__dirname + '/../bin/bxenv.js') + '" sendmail';
    if (fileExists(dest))
        return;

    var conf = fs.readFileSync(__dirname + '/../config/php.ini').toString();

    var extDir = __dirname + '/../server/';
    if (php_version == '56') {
        extDir += 'php-5.6.25-Win32-VC11-x86'
    } else {
        extDir += 'php-7.0.9-Win32-VC14-x86'
    }
    extDir = path.resolve(extDir + '/ext');

    conf = conf.replace(/#EXTENSION_DIR#/g, extDir);
    conf = conf.replace(/#SENDMAIL_PATH#/g, sendMailpath);

    fs.writeFileSync(dest, conf);
}

function copyMyIni(cwd) {
    var dest = cwd + '/bxenv/my.ini';
    if (fileExists(dest))
        return;

    var conf = fs.readFileSync(__dirname + '/../config/my.ini').toString();
    var dataDir = path.resolve(cwd + '/bxenv/data').replace(/\\/g, '/');
    conf = conf.replace(/#DATA_DIR#/g, dataDir);
    fs.writeFileSync(dest, conf);
}

function initWWW(cwd) {
    if (dirExists(cwd + '/www'))
        return;
    mkdir(cwd + '/www');
    copyDir(__dirname + '/../www', cwd + '/www')
}

function initDB(cwd) {

    var mysqld = path.resolve(__dirname + '/../server/mysql-5.7.14-win32/bin/mysqld.exe');
    var myIni = path.resolve(cwd + '/bxenv/my.ini');
    var dataDir = path.resolve(cwd + '/bxenv/data');
    if (dirExists(dataDir))
        return;
    var cmd = [
        mysqld,
        '--defaults-file="' + myIni + '"',
        '--datadir="' + dataDir + '"',
        '--initialize-insecure',
        // '--console',
    ];
    console.info(cmd.join(' '));
    execSync(cmd.join(' '));
}