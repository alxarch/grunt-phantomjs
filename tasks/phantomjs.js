var phantomjs = require("phantomjs").path;
var spawn = require("child_process").spawn;
var path = require("path");
var async = require("async");
var arrayify = require("../lib/utils").arrayify; 
var ident = require("../lib/utils").ident; 

var script = path.resolve(__dirname, '../lib/task.js');

module.exports = function (grunt) {
	grunt.registerMultiTask("phantomjs", "Run tasks on phantomjs.", function () {
		var done = this.async();
		var o = this.options({});
		var inject = arrayify(o.inject);
		var jobs = [];
		var options = [
			o.images ? '--load-images=' + !!o.images : null,
			o.cookies ? '--cookies-file=' + o.cookies : null,
			o.cache ? '--disk-cache=' + !!o.cache : null
		].filter(ident);

		this.files.forEach(function (file) {
			[].concat(file.src).map(function (f) {
				jobs.push(function (callback) {
					var args = [].concat(options, script, f);
					inject.forEach( function (i) {
						args.push("-i");
						args.push(i);
					});
					var p = spawn(phantomjs, args);
					p.stdout.pipe(process.stdout);
					p.stderr.pipe(process.stderr);
					p.on("exit", function (code) {
						var error;
						if (code !== 0) {
							error = new Error("Phantomjs exited with code: " + code); 
						}
						callback(error);
					});
				});		
			});
		});

		async[o.parallel ? 'parallel' : 'series'](jobs, done);
	});
};