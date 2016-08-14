var resolve = require('path').resolve;


let bxenvDir = resolve(__dirname + '/..');
var workDir = process.cwd();

var path = {

    bxenv: bxenvDir,
    bxenv_configDir: bxenvDir + '/config',
    bxenv_wwwDir: bxenvDir + '/www',
    bxenv_phpDir: bxenvDir + '/server/httpd-2.4.23-x64-vc14',
    bxenv_phpExtDir: bxenvDir + '/server/httpd-2.4.23-x64-vc14/ext',
    bxenv_phpModule: bxenvDir + '/server/php-7.0.9-Win32-VC14-x64/php7apache2_4.dll',
    bxenv_mysqld: bxenvDir + '/server/mysql-5.7.14-winx64/bin/mysqld',
    bxenv_mysql: bxenvDir + '/server/mysql-5.7.14-winx64/bin/mysql',
    bxenv_httpd: bxenvDir + '/server/httpd-2.4.23-x64-vc14/bin/httpd',

    work: workDir,
    work_configDir: workDir + '/bxenv',
    work_wwwDir: workDir + '/www',
    work_httpdconf: workDir + '/bxenv/httpd.conf',
    work_phpini: workDir + '/bxenv/php.ini',
    work_mysqldata: workDir + '/bxenv/data',
    work_mysqlini: workDir + '/bxenv/my.ini',
};


for (var defineName in path) {
    if (!path.hasOwnProperty(defineName))
        continue;
    path[defineName] = resolve(path[defineName]);
}


module.exports = path;


/*

 var Folder = function (rootFolder) {
 this.rootFolder = resolve(rootFolder);
 };

 Folder.prototype.toString = function () {
 return this.rootFolder
 };

 Folder.prototype.set = function (obj) {
 for (var name in obj) {
 if (obj.hasOwnProperty(name))
 this[name] = resolve(this.rootFolder + obj[name]);
 }
 };

 var bxenvFolder = new Folder(__dirname + '..');
 var workFolder = new Folder(process.cwd());

 bxenvFolder.set({
 configDir: '/config',
 wwwDir: '/www',
 });

 workFolder.set({
 configDir: '/bxenv',
 wwwDir: '/www',
 });


 module.exports = {
 bxenv: bxenvFolder,
 work: workFolder,
 };



 */









