'use strict';


switch (process.argv[2]) {
    case 'init':
        require('./lib/init');
        break;
    case 'start':
        require('./lib/start');
        break;

}