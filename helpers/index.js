const fs = require('fs');
const path = require('path');

const helpers = {};

// Read all files in the helpers directory
fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const helperFunction = require(path.join(__dirname, file));
        const helperName = path.basename(file, '.js');
        helpers[helperName] = helperFunction;
    }
});

module.exports = helpers;