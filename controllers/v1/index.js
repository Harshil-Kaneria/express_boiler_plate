// controllers/v1/index.js
const fs = require('fs');
const path = require('path');

// Get the directory path
const controllersDir = __dirname;

// Create a mapping of controller names to their required functions
const controllers = {};

// Read each file in the directory
fs.readdirSync(controllersDir).forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
        const controllerName = file.replace('.js', ''); // Remove the .js extension
        controllers[controllerName] = require(path.join(controllersDir, file));
    }
});

module.exports = controllers;
