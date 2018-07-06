const path = require('path');

module.exports = {
    context: path.join(__dirname, '/'),
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
