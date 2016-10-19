var fs = require('fs');
var mkdir = require('mkdirp').sync;

module.exports = function () {

    var cwd = process.cwd();

    var emailDir = cwd + '/bxenv/mail/';
    mkdir(emailDir);

    var date = new Date();
    var fileName = '';
    fileName += date.getFullYear() + '-0';
    fileName += date.getMonth() + '-0';
    fileName += date.getDate() + '_0';
    fileName += date.getHours() + '-0';
    fileName += date.getMinutes() + '-0';
    fileName += date.getSeconds() + '_' + rnd(3) + '.msg';

    fileName = fileName.replace(/(\D)(\d)(\d\d)/g, '$1$3');


    process.stdin.on('readable', () => {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            fs.appendFileSync(emailDir + fileName, chunk);
        }
    });

};


function rnd(len) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}