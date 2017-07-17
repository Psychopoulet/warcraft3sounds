
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
	const coveralls = require("gulp-coveralls");

// private

	var _unitTestsFiles = path.join(__dirname, "tests", "*.js");
	var _libFiles = path.join(__dirname, "lib", "*.js");
	
	var _toTestFiles = [
		path.join(__dirname, "gulpfile.js"),
		_libFiles,
		_unitTestsFiles
	];

// tasks

	gulp.task("pre-test", () => {

		return gulp.src([ _libFiles ])
			.pipe(istanbul())
			.pipe(istanbul.hookRequire());

	});

	gulp.task("eslint", ["pre-test"], () => {

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

	gulp.task("mocha", ["eslint"], () => {

		return gulp.src(_unitTestsFiles)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));

	});

	gulp.task("coveralls", ["mocha"], () => {

		return gulp.src("test/coverage/**/lcov.info")
			.pipe(coveralls());

	});

// watcher

	gulp.task("watch", () => {
		gulp.watch(_toTestFiles, ["coveralls"]);
	});


// default

	gulp.task("default", ["coveralls"]);
	