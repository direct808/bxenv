'use strict';
switch (process.argv[2]) {
    case 'init':
        require('./lib/init');
        break;
    case 'start':
        require('./lib/start');
        break;
    case 'sendmail':
        // require('../lib/start');
        break;

}

// if (process.argv[2] == 'sendmail') {
//     process.stdin.on('readable', () => {
//         var chunk = process.stdin.read();
//         if (chunk !== null) {
//             fs.appendFile('c:/asdasd.txt', chunk);
//             // process.stdout.write(`data: ${chunk}`);
//         }
//     });
// }


/*
 const path = require('path');
 var exec = require('child_process').exec;


 var httpPath = path.resolve(__dirname + '/../server/apache24/bin/httpd.exe');

 var httpConfPath = path.resolve(process.cwd() + '/bxenv/httpd.conf');

 var runHttpd = function () {
 exec(httpPath + ` -f ${httpConfPath}`, {}, function (error, stdout, stderr) {
 console.log('error!:', error);
 console.log('stdout!:', stdout.toString());
 console.log('stderr!:', stderr.toString());
 });
 };
 // runHttpd();


 console.log(process.argv[2]);

 // var fun =function(){
 //     console.log("fun() start");
 //     exec(ghjgh+' -f asdasd.conf', function(err, data) {
 //         console.log(err)
 //         console.log(data.toString());
 //     });
 // }
 // fun();

 // var opener = require('opener');

 // opener('http://localhost:8045');

 // exec('http://localhost:8045');

 // console.log(ghjgh + ' -f C:\\bxenv\\bxenv\\httpd.conf');
 */