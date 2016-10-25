/*
* @Author: eleven
* @E-mail: eleven.image@gmail.com
* @Date:   2016-10-25 20:35:46
* @Last Modified by:   eleven
* @Last Modified time: 2016-10-25 21:59:12
*/

'use strict';

let assert = require('assert');
let es = require('event-stream');
let File = require('vinyl');
let flowUrl = require('../');

describe('gulp-flow-url', function() {
	describe('in buffer mode', function() {
		it('replace app path', function(done) {

			let file = new File({
				cwd: '/',
  				base: '/test/',
  				path: '/test/file.js',
				contents: new Buffer('var x = 123 page.js ./page.js /page.js eleven')
			});

			let flow = flowUrl({
				version: 1.3,
				cdn: 'https://static.taolx.com/',
				exclude: ['eleven']
			});

			flow.write(file);

			flow.once('data', function(file) {

				assert(file.isBuffer());
				assert.equal(file.contents.toString('utf8'), 'var x = 123 https://static.taolx.com/1.3/test/page.js https://static.taolx.com/1.3/test/page.js https://static.taolx.com/1.3/test/page.js eleven');
				done();
			
			})
		})
	})
})