'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const path = require('path');
const PLUGIN_NAME = 'gulp-flow-url';

function gulpReplaceUrl(options) {

    let opts = options || {};
    let ver = opts.version || '';
    let cdn = opts.cdn || '';
    let exclude = opts.exclude || '';

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
            let basePath = mainPath.replace(modname, '');

            let prefixer = cdn + ver + basePath;

            let reg = /([\w\.\-\/]+\/)*[\w\.\-\/]+\.(js|css|png|jpeg|jpg|gif|svg|ttf)/gim;

            file.contents = new Buffer(file.contents.toString().replace(reg, (content) => {
                if(content.indexOf('hm.baidu.com/hm.js') > -1) {
                    console.log(exclude);
                    return content;
                }
                if(content[0] === '\.' || content[0] === '\/') {
                    content = content.substr(content.indexOf('\/') + 1);
                }
                if(content.indexOf('common') > -1) {
                    content = content.substr(content.indexOf('common'));
                    return content = cdn + content;
                }
                return content = prefixer + '/' + content;
            }));

        }
        
        cb(null, file);
    });

};

module.exports = gulpReplaceUrl;