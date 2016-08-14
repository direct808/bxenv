let fs = require('fs');
let exec = require('child_process');
let path = require('path');
let utils = require('./lib/utils');


let workDir = process.cwd();
let moduleDir = __dirname;

function createBaseDir() {
    try {
        fs.mkdirSync(workDir + '/bxenv/');
    } catch (e) {
        if (e.code != 'EEXIST') {
            console.log(e.toString());
            process.exit(1);
        }
    }
}

function createWwwDir() {
    try {
        fs.mkdirSync(workDir + '/www/');
    } catch (e) {
        if (e.code != 'EEXIST') {
            console.log(e.toString());
            process.exit(1);
        }
    }
}

function copyConfigApache() {
    let content = fs.readFileSync(moduleDir + '/config/httpd.conf').toString();
    fs.writeFileSync(utils.path.apache.config, content);


    utils.setApacheFileConfigDefine(utils.path.apache.config, {
        BXENVMODULEDIR: moduleDir,
        BXENVWORKDIR: workDir,
        PORT: 81,
    });


}

function copyConfigPhp() {
    let content = fs.readFileSync(moduleDir + '/config/php.ini').toString();
    let extDir = path.resolve(`${moduleDir}/server/php/ext`);
    content = content.replace(/^\s?extension_dir\s?\=\s?(.*?)$/gm, `extension_dir = "${extDir}"`);
    fs.writeFileSync(workDir + '/bxenv/php.ini', content);
}

function copyConfigMySql() {
    let dataDir = path.resolve(workDir + '/bxenv/data').replace(/\\/g, '/');
    // dataDir = dataDir.replace(/\\/g, '/');
    let content = fs.readFileSync(moduleDir + '/config/my.ini').toString();

    content = content.replace(/^\s?datadir\s?\=\s?(.*?)$/gm, 'datadir=' + dataDir);
    // console.log(contentMyConf);

    fs.writeFileSync(workDir + '/bxenv/my.ini', content);
}

function createDB() {
    let patchMysqld = moduleDir + '\\server\\mysql\\bin\\mysqld.exe';
    let cmd = `${patchMysqld} --console --initialize-insecure --datadir=${workDir}/bxenv/data`;
    exec.exec(cmd, function (error, stdout, stderr) {
        if (error)
            console.log(error.toString());
    });
}


createBaseDir();
createWwwDir();
copyConfigApache();
copyConfigPhp();
copyConfigMySql();
createDB();



