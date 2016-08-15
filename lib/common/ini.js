var fs = require('fs');
var iniBuilder = require('ini-builder');

function write(filePath, values) {
    var data = iniBuilder.parse(fs.readFileSync(filePath));
    for (var name in values) {
        if (values.hasOwnProperty(name)) {
            iniBuilder.find(data, name).value = values[name];
        }
    }
    fs.writeFileSync(filePath, iniBuilder.serialize(data));
}


module.exports.write = write;