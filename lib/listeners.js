var fs = require('fs');
var path = global.node_modules.path;
var _ = require('lodash');
var defaults = {
	render: function (p, selector) {

	},
	write: function (p, dest, data) {
		dest = path.resolve(dest);
		fs.makeTree(path.dirname(dest));
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}
		fs.write(dest, data, 'w');
	},
	copy: function (p, src, dest) {
		dest = path.resolve(dest);
		src = path.resolve(src);
		fs.makeTree(path.dirname(dest));
		if (fs.isFile(dest)) {
			throw new Error('File already exists: ' + dest);
		}
		fs.copy(src, dest);
	}
};

var load = function (listeners) {
	var result = {};
	if (listeners) {
		if (_.isString(listeners)) {
			try {
				_.extend(result, require(path.resolve(listeners)));
			}
			catch (e) {}
		}
		else if (_.isObject(listeners)) {
			_.forOwn(listeners, function (name, file) {
				try {
					result[name] = require(path.resolve(file));
				}
				catch (e) {}
			});
		}
	}

	return result;
};

module.exports = {
	load: load,
	defaults: defaults
};