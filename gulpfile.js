
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

	// report
	const isCI = require("is-ci");
	const coveralls = require("gulp-coveralls");

// consts

	const UNITTESTSFILES = path.join(__dirname, "tests", "*.js");
	const LIBFILES = path.join(__dirname, "lib", "*.js");

	const TOTESTFILES = [
		path.join(__dirname, "gulpfile.js"),
		LIBFILES,
		path.join(__dirname, "lib", "api", "**", "*.js"),
		UNITTESTSFILES
	];

	const ESLINTRULES = require(path.join(__dirname, "gulpfileeslintrules.json"));

// tasks

	gulp.task("eslint", () => {

		return gulp.src(TOTESTFILES)
			.pipe(plumber())
			.pipe(eslint({
				"env": {
					"es6": true,
					"mocha": true,
					"node": true
				},
				"parserOptions": {
					"ecmaVersion": 6
				},
				"rules": ESLINTRULES
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("istanbul", [ "eslint" ], () => {

		return gulp.src(TOTESTFILES)
			.pipe(istanbul())
			.pipe(istanbul.hookRequire());

	});

	gulp.task("mocha", [ "istanbul" ], () => {

		return gulp.src(UNITTESTSFILES)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports());

	});

// report

	gulp.task("coveralls", [ "mocha" ], () => {

		return !isCI
			? Promise.resolve()
			: gulp.src(path.join(__dirname, "coverage", "lcov.info")).pipe(coveralls());

	});

// watcher

	gulp.task("watch", () => {
		gulp.watch(TOTESTFILES, [ "eslint" ]);
	});

// default

	gulp.task("default", [ "mocha" ]);
