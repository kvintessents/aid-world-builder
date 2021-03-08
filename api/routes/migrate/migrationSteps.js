const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir).bind(fs);

const dir = path.join(__dirname, './steps');

module.exports = async function migrationSteps() {
    const files = await readdir(dir);

    return files.map(fileName => ({
        id: parseInt(fileName.split('_')[0], 10),
        fileName: fileName,
        action: require(path.join(dir, fileName)),
    }));
};
