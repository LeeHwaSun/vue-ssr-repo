import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

const requireModule = require.context('.', true, /(Form|List|Detail)\.vue$/, 'lazy');
const modules = {};

requireModule.keys().forEach(filename => {
    const moduleName = upperFirst(camelCase(filename.replace(/(\.\/|\.vue)/g, '')));
    modules[moduleName] = () => requireModule(filename);
});

export default modules;