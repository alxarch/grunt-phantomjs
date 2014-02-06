var _ = require("lodash");
var async = require("async");
var phantomtask = require("phantomtask");

module.exports = function (grunt) {
	grunt.registerMultiTask("phantomjs", "Run tasks on phantomjs.", function () {
		var jobs = [];

		var done = this.async();
		var options = this.options({});

		this.files.forEach(function (file) {
			var opt = _.extend({output: file.dest}, options);
			[].concat(file.src).forEach(function (src) {
				jobs.push(function (callback) {
					phantomtask(src, opt, callback);
				});
			});
		});
		async.parallel(jobs, done);
	});
};
