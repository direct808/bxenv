const path = require('path');
const fs = require('fs');
const util = require('util');

let getFirstAvailable = function (startPort, endPort) {
    return new Promise(function (resolve, reject) {
        require('portchecker').getFirstAvailable(startPort, endPort, 'localhost', function (port) {
            port > 0 ? resolve(port) : reject();
        });
    });
};

module.exports.getFirstAvailable = getFirstAvailable;

let dirWork = process.cwd();
let dirModule = path.resolve(__dirname + '/..');

module.exports.path = {
    apache: {
        config: path.resolve(dirWork + '/bxenv/httpd.conf'),
        httpd: path.resolve(dirModule + '/server/httpd-2.4.23-x64-vc14/bin/httpd.exe'),

    },
    mysql: {
        config: path.resolve(dirWork + '/bxenv/my.ini'),
        mysqld: path.resolve(dirModule + '/server/mysql-5.7.14-winx64/bin/mysqld.exe'),
        admin: path.resolve(dirModule + '/server/mysql-5.7.14-winx64/bin/mysqladmin.exe'),
        log: path.resolve(dirWork + "/bxenv/mysqld.log")
    }
};

module.exports.fileExists = function (filePath) {
    try {
        fs.statSync(path.resolve(filePath));
    } catch (e) {
        if (e.code == "ENOENT") {
            return false;
        } else {
            throw (e.code);
        }
    }
    return true;
};


module.exports.setApacheFileConfigDefine = function (filePath, values) {
    let content = fs.readFileSync(filePath).toString();
    for (let defineName in values) {
        let defineValue = values[defineName];
        let regexp = new RegExp(`^\\s?Define\\s+${defineName}\\s+(.*?)$`, 'gm');

        let q = util.isNumber(defineValue) ? '' : '"';

        content = content.replace(regexp, `Define ${defineName} ${q}${defineValue}${q}`);
    }
    fs.writeFileSync(filePath, content);
};


module.exports.setPhpMysqlFileConfig = function (filePath, values) {
    let content = fs.readFileSync(filePath).toString();
    for (let defineName in values) {
        let defineValue = values[defineName];
        let regexp = new RegExp(`^\\s?${defineName}\\s?\\=\\s?(.*?)$`, 'gm');
        content = content.replace(regexp, `${defineName}=${defineValue}`);
    }
    // console.log(content);
    fs.writeFileSync(filePath, content);
};


// module.exports.setPhpFileConfig('C:/asdasd.txt', {
//     extension_dir: "3333333333333333333",
//     BXENVMODULEDIR2: "4444444444444444444444",
//     BXENVMODULEDIR3: "5555",
// });
// console.log(module.exports.path);

// if(exports.fileExists('C:/asdasd.txt1')){
//     console.log('exists ');
// }else{
//     console.log('No exists ');
// }