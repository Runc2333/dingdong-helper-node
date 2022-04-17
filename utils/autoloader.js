const fs = require('fs-extra');
const path = require('path');

let files = fs.readdirSync(__dirname, { withFileTypes: true });

for (let file of files) {
    if (file.isDirectory()) {
        let entrance_script = path.join(__dirname, file.name, 'index.js');
        if (fs.existsSync(entrance_script)) {
            global[file.name] = require(entrance_script);
        }
        continue;
    }
    if (/autoloader\.js/.test(file.name)) {
        continue;
    }
    let util = require(path.join(__dirname, file.name));
    if (!util) {
        continue;
    }
    global[file.name.split('.').shift()] = Object.freeze(util);
}