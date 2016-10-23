'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PLUGIN_NAME = 'gulp-flow-url';

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function gulpReplaceUrl(options) {

    let opts = options || {};
    let env = opts.env || 'development';
    let ver = opts.version || '';
    let cdn = opts.cdn || '';

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

            console.log(prefixer);

            let reg = /([\w\.\-\/]+\/)*[\w\.\-\/]+\.(js|css|png|jpeg|jpg|gif|svg|ttf)/gim;
            file.contents = new Buffer(file.contents.toString().replace(reg, (content) => {
                if(content[0] === '\.' || content[0] === '\/') {
                    content = content.substr(content.indexOf('\/') + 1);
                    console.log(content);
                }
                if(content)
                if(content.indexOf('hm.baidu.com/hm.js') > -1) {
                    return content;
                }
                if(content.indexOf('common/') > -1) {
                    content = content.substr(content.indexOf('common/'));
                    return content = cdn + content;
                }
                return content = prefixer + '/' + content
            }));

        cb(null, file);

    });

};

module.exports = gulpReplaceUrl;