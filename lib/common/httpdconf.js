var util = require('util');
var fs = require('fs');


module.exports.write = write;
module.exports.read = read;

function write(filePath, values) {
    let content = fs.readFileSync(filePath).toString();

    // content = content.replace(/\n/ig, '');


    for (var defineName in values) {
        if (!values.hasOwnProperty(defineName))
            continue;
        let defineValue = values[defineName];
        let regexp = new RegExp(`^Define\\s+${defineName}\\s+.+$`, 'm');

        let q = util.isNumber(defineValue) ? '' : '"';

        content = content.replace(regexp, `Define ${defineName} ${q}${defineValue}${q}`);
    }
    fs.writeFileSync(filePath, content);
};

function read(filePath, valueName) {
    let content = fs.readFileSync(filePath).toString();
    let regexp = new RegExp(`^Define\\s+${valueName}\\s+(.+)$`, 'm');
    return regexp.exec(content)[1];
};