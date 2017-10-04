
"use strict";

// deps

	const path = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const istanbul = require("gulp-istanbul");
	const eslint = require("gulp-eslint");
	const mocha = require("gulp-mocha");

// consts

	const APP_FILES = [
		path.join(__dirname, "lib", "*.js"),
		path.join(__dirname, "lib", "server", "**", "*.js"),
		path.join(__dirname, "lib", "api", "**", "*.js")
	];

	const FRONT_FILES = [
		path.join(__dirname, "lib", "web", "**", "*.js"),
		"!" + path.join(__dirname, "lib", "web", "**", "*.min.js")
	];

	const UNITTESTS_FILES = [ path.join(__dirname, "tests", "**", "*.js") ];

	const ALL_FILES = [ path.join(__dirname, "gulpfile.js") ]
		.concat(APP_FILES)
		.concat(FRONT_FILES)
		.concat(UNITTESTS_FILES);

// tasks

	gulp.task("eslint", () => {

		return gulp.src(ALL_FILES)
			.pipe(plumber())
			.pipe(eslint({
				"env": require(path.join(__dirname, "gulpfile", "eslint", "env.json")),
				"globals": require(path.join(__dirname, "gulpfile", "eslint", "globals.json")),
				"parserOptions": {
					"ecmaVersion": 6
				},
				// http://eslint.org/docs/rules/
				"rules": require(path.join(__dirname, "gulpfile", "eslint", "rules.json"))

			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("istanbul", [ "eslint" ], () => {

		return gulp.src(APP_FILES.concat([ "!" + path.join(__dirname, "lib", "main.js") ]))
			.pipe(plumber())
			.pipe(istanbul({ "includeUntested": true }))
			.pipe(istanbul.hookRequire());

	});

	// @TODO : add nsp control
	// gulp.task("nsp", [ "istanbul" ], () => {
	// });

	gulp.task("mocha", [ "istanbul" ], () => {

		return gulp.src(UNITTESTS_FILES)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ "thresholds": { "global": 80 } }));

	});

// watcher

	gulp.task("watch", () => {
		gulp.watch(ALL_FILES, [ "eslint" ]);
	});

// default

	gulp.task("default", [ "mocha" ]);
