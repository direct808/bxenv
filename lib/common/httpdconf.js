var util = require('util');
var fs = require('fs');

var write = function (filePath, values) {
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

module.exports.write = write;