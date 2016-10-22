'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PLUGIN_NAME = 'gulp-flow';

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function gulpReplaceUrl(options) {

    let opts = options || {};
    let env = opts.env || 'development';
    let ver = opts.version || '';
    let cdn = opts.cdn || '';

    console.log('env', env);
    console.log('cdn', cdn);
    console.log('ver', ver);

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
                if(content.indexOf('hm.baidu.com/hm.js') !== -1) {
                    return content;
                }
                if(content.indexOf('common/') !== -1) {
                    content = content.substr(content.indexOf('common/'));
                    return content = cdn + content;
                }
                return content = prefixer + '/' + content
            }));
        //     console.log(modname);
        //     console.log(mainPath);
        //     // file.contents.replace('page.')
            // file.contents = Buffer.concat([cur, prefixText]);
        // }
        // if (file.isBuffer()) {
        //     console.log(file.isBuffer());
        //     console.log(file.base);
        //     console.log(file.path);
        //     console.log(file.dirname);
        //     console.log(file.basename);
        //     console.log(file.relative);
        //     console.log(process.cwd());
        //     let modname = path.resolve(process.cwd());
        //     let mainPath = path.dirname(file.path);
        //     console.log(mainPath.replace(modname, ''));
        //     let curPath = mainPath.replace(modname, '');
        //     let reg = /(\w+\/)+\w+\.png|jpeg|jpg|gif|svg|ttf/gim;
        //     let contents = file.contents.toString().replace(reg, function(content) {
        //         console.log(1);
        //         console.log(content);
               
        //         content = '1.2'+ curPath + content;
        //         return content;
        //     });
        //     console.log(modname);
        //     console.log(mainPath);
        //     let cur = new Buffer(contents);
        //     file.contents = Buffer.concat([cur, prefixText]);
        // }
        // if (file.isBuffer()) {

        //     // console.log(file.isBuffer());
        //     // console.log(file.base);

        //     // console.log(process.cwd());

        //     let reg = /(|'|")([\w\.\-]+\/)+[\w\.\-]+\.(js|css|png|jpeg|jpg|gif|svg|ttf)("|'|)/gim;
            
        //     let fileHashFile = md5(file.contents.toString()).slice(0, 8) + path.extname(file.path);

        //     let fileName = path.basename(file.path, path.extname(file.path));

            // console.log(fileName);
            // console.log(fileHashFile);

            // var reg = /(\w\/)+\w+.png|jpeg|jpg|gif|js|css/
            // let contents = file.contents.toString().replace(reg, function(content) {
            //     console.log(1);
            //     console.log(content);
               
            //     content = '1.2'+ curPath + content;
            //     return content;
            // });
            // console.log(modname);
            // console.log(mainPath);
            // let cur = new Buffer(contents);
            // file.contents = Buffer.concat([cur, prefixText]);
        }

        cb(null, file);

    });

};

module.exports = gulpReplaceUrl;