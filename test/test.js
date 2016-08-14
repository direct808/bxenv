var exec = require('child_process').exec;
var resolve = require('path').resolve;
var mkdir = require('mkdirp').sync;

//----------------------
var COUNT_PROJECTS = 3;
//----------------------
var binJs = resolve(__dirname + '/../index.js');
var cmd = 'node ' + binJs + ' init';


for (var i = 1; i <= COUNT_PROJECTS; i++) {
    var projDir = __dirname + '/project' + i
    mkdir(projDir);
    exec(cmd, {cwd: projDir}, execHandler).stdout.on('data', dataHandler);
}

function execHandler(error, stdout, stderr) {
    if (error) {
        console.warn(error.toString());
    }
}

function dataHandler(data) {
    console.info(data);
}