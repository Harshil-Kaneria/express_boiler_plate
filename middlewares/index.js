const fs = require('fs');
const path = require('path');

const middlewares = {};

// Read all files in the middlewares directory
fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const middlewareFunction = require(path.join(__dirname, file));
        const middleware = path.basename(file, '.js');
        middlewares[middleware] = middlewareFunction;
    }
});

module.exports = middlewares;