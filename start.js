let fs = require('fs');
let exec = require('child_process');
let path = require('path');
let utils = require('./lib/utils');


let dirModule = __dirname;


function runHttpd(port) {


    let daemonPath = utils.path.apache.httpd;
    let configPath = utils.path.apache.config;

    // utils.setApacheFileConfigDefine(configPath, {PORT: port});

    if (!utils.fileExists(daemonPath)) {
        throw Error('File not found ' + daemonPath);
    }

    if (!utils.fileExists(configPath)) {
        throw Error('File not found ' + configPath);
    }

    let cmd = [daemonPath, `-f "${configPath}"`];
    exec.exec(cmd.join(' '), function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });

    console.log('Started',cmd.join(' '))
    // console.log(`server started on http://localhost:${port}/`)

    // return exec.exec(cmd.join(' '), function (error, stdout, stderr) {
    //     if (error)
    //         console.log(error.toString());
    // });
}

function runMysql() {

    let configPath = utils.path.mysql.config;
    let mysqldPath = utils.path.mysql.mysqld;
    let logPath = utils.path.mysql.log;

    if (!utils.fileExists(configPath)) {
        throw Error('File not found ' + configPath);
    }
    if (!utils.fileExists(mysqldPath)) {
        throw Error('File not found ' + mysqldPath);
    }


    let arCmd = [
        mysqldPath,
        `--defaults-file="${configPath}"`,
        `--log-error="${logPath}"`
    ];
    let cmd = arCmd.join(" ");

    // let cmd = `${mysqldPath} --defaults-file="${configPath}" --defaults-extra-file="${configPath}" --log-error="${logPath}"`;
    // console.log('Exec command', cmd);
    return exec.exec(cmd, function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });
}

function stopMysql() {
    let params = [
        utils.path.mysql.admin,
        '-u root',
        'shutdown',
        '-P 3306'
    ];

    exec.exec(params.join(' '), function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });
}


var proc_http = runHttpd();
var msql = runMysql();

process.on('SIGINT', (code) => {
    stopMysql();
    // console.log(`About to exit with code: ${code}`);
    // proc_http.kill();
    // msql.kill();
    // process.exit();
});


// --datadir="${dirWork}/bxenv/data"
// console.log('process pid = ', proc.pid);


// utils.getFirstAvailable(3000, 3100)
//     .then(port=> {
//         runHttpd(port);
//     })
//     .catch(()=> {
//         throw Error('No available ports range', 3000, 3100);
//     });