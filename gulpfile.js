
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

// private

	var _unitTestsFiles = path.join(__dirname, "tests", "*.js");
	var _libFiles = path.join(__dirname, "lib", "*.js");
	
	var _toTestFiles = [
		path.join(__dirname, "gulpfile.js"),
		_libFiles,
		path.join(__dirname, "lib", "api", "**", "*.js"),
		_unitTestsFiles
	];

// tasks

	gulp.task("eslint", () => {

		return gulp.src(_toTestFiles)
			.pipe(plumber())
			.pipe(eslint({
				"parserOptions": {
					"ecmaVersion": 6
				},
				"rules": {
					"linebreak-style": 0,
					"quotes": [ 1, "double" ],
					"indent": 0,
					// "indent": [ 2, "tab" ],
					"semi": [ 2, "always" ]
				},
				"env": {
					"node": true, "es6": true, "mocha": true
				},
				"extends": "eslint:recommended"
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("istanbul", ["eslint"], () => {

		return gulp.src(_toTestFiles)
			.pipe(istanbul())
			.pipe(istanbul.hookRequire());

	});

	gulp.task("mocha", ["istanbul"], () => {

		return gulp.src(_unitTestsFiles)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports());

	});

// report

	gulp.task("coveralls", ["mocha"], () => {

		if (!isCI) {
			return Promise.resolve();
		}
		else {

			return gulp.src(path.join(__dirname, "coverage", "lcov.info"))
				.pipe(coveralls());
			
		}

	});

// watcher

	gulp.task("watch", () => {
		gulp.watch(_toTestFiles, ["mocha"]);
	});


// default

	gulp.task("default", ["mocha"]);
	