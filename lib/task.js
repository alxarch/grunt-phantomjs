var _ = require("lodash");
var process = require("node-ish");
var opt = require("optimist");
var path = global.node_modules.path;

opt.options("l", {
	alias: "listeners",
	describe: "A module to use for listening to page events."
});

opt.options("i", {
	alias: "inject",
	describe: "Inject script(s) to the page."
});

var argv = opt.argv; 
var src = argv._[0];
var dest = argv._[1];
var inject = [].concat(argv.inject || []);
var listen = argv.listeners || {};

var page = require('./webpage').create();

var listeners = require("./listeners");
_(listeners.load(listen))
	.defaults(listeners.defaults)
	.forOwn(function (name, listener) {
		page.on(name, listener);
	});

page.open(src, function (status) {
	if (status !== "success") {
		console.error("Failed to open page: " + src);
		process.exit(1);
	}

	inject.forEach(function (script) {
		page.injectJs(script);
	});
	page.on('exit', function (code) {
		process.exit(code || 0);
	});
});