var exec = require('child_process').exec;


function execPromise(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, function (error, stdout, stderr) {
            if (error)
                reject(error);
            else
                resolve(stdout)
        });
    });
}


module.exports.execPromice = execPromise;