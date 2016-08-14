var util = require('util');
var fs = require('fs');

var write = function (filePath, values) {
    let content = fs.readFileSync(filePath).toString();
    for (var defineName in values) {
        if (!values.hasOwnProperty(defineName))
            continue;
        let defineValue = values[defineName];
        let regexp = new RegExp(`^\\s?Define\\s+${defineName}\\s+(.*?)$`, 'gm');

        let q = util.isNumber(defineValue) ? '' : '"';

        content = content.replace(regexp, `Define ${defineName} ${q}${defineValue}${q}`);
    }
    fs.writeFileSync(filePath, content);
};

module.exports.write = write;