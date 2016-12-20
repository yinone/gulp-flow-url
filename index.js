'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const path = require('path');
const PLUGIN_NAME = 'gulp-flow-url';

function gulpReplaceUrl(options = {}) {
   
    Object.keys(options).forEach( (key, i, arr) => {

        if(options[key] && !/\/$/.test(options[key])){
            console.log(options[key])
            console.log(key);
            options[key] += '/';
        }
    });

    let ver = options.version || '';
    let cdn = options.cdn || '';
    let prefix = options.prefix || '';
    
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {

            let modname = path.resolve(process.cwd());
            let mainPath = path.dirname(file.path);
            let basePath = mainPath.replace(modname, '').slice(1);
            
            let prefixer = cdn + prefix + ver + basePath;
            let reg = /([\w\.\-\/]+\/)*[\w\.\-\/]+\.(js|css|png|jpeg|jpg|gif|svg|ttf)/gim;

            file.contents = new Buffer(file.contents.toString().replace(reg, (content) => {
                if(content.indexOf('hm.baidu.com/hm.js') > -1) {
                    return content;
                }
                if(content[0] === '\.' || content[0] === '\/') {
                    content = content.slice(content.indexOf('\/') + 1);
                }
                if(content.indexOf('common') > -1) {
                    content = content.slice(content.indexOf('common'));
                    return content = cdn + prefix + content;
                }
                return content = prefixer + '/' + content;
            }));

        }
        cb(null, file);
    });

};

module.exports = gulpReplaceUrl;