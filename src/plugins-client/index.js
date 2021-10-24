import camelCase from 'lodash/camelCase';

const requireModule = require.context('.', false, /\.js$/);
const modules = {};
const ignore = ['./index.js'];

requireModule.keys().forEach(filename => {
    if (ignore.indexOf(filename) < 0) {
        const moduleName = camelCase(filename.replace(/(\.\/|\.js)/g, ''));
        modules[moduleName] = requireModule(filename);
    } 
});