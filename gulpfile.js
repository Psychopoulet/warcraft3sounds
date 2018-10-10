"use strict";

// deps

	const { join } = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const eslint = require("gulp-eslint");
	const mocha = require("gulp-mocha");

	// reports
	const istanbul = require("gulp-istanbul");
	const coveralls = require("gulp-coveralls");

	const checkUpdates = require(join(__dirname, "gulpfile", "checkUpdates.js"));

// consts

	const GULP_FILES = [ join(__dirname, "gulpfile", "*.js") ];
	const APP_FILES = [ join(__dirname, "lib", "**", "*.js") ];
	const UNITTESTS_FILES = [ join(__dirname, "tests", "**", "*.js") ];

	const ALL_FILES = [ join(__dirname, "gulpfile.js") ]
		.concat(GULP_FILES)
		.concat(APP_FILES)
		.concat(UNITTESTS_FILES);

// tasks

	gulp.task("eslint", () => {

		return gulp.src(ALL_FILES)
			.pipe(plumber())
			.pipe(eslint({
				"env": require(join(__dirname, "gulpfile", "eslint", "env.json")),
				"globals": require(join(__dirname, "gulpfile", "eslint", "globals.json")),
				"parserOptions": {
					"ecmaVersion": 6
				},
				// http://eslint.org/docs/rules/
				"rules": require(join(__dirname, "gulpfile", "eslint", "rules.json"))
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("istanbul", gulp.series("eslint", () => {

		return gulp.src(APP_FILES)
			.pipe(plumber())
			.pipe(istanbul({ "includeUntested": true }))
			.pipe(istanbul.hookRequire());

	}));

	gulp.task("mocha", gulp.series("istanbul", () => {

		return gulp.src(UNITTESTS_FILES)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ "thresholds": { "global": 85 } }));

	}));

	gulp.task("coveralls", gulp.series("mocha", () => {

		return gulp.src(join(__dirname, "coverage", "lcov.info"))
			.pipe(plumber())
			.pipe(coveralls());

	}));

// security

	gulp.task("check-updates", gulp.series("eslint", () => {
		return checkUpdates(join(__dirname, "package.json"));
	}));

// watcher

	gulp.task("watch", () => {
		gulp.watch(ALL_FILES, [ "eslint" ]);
	});


// default

	gulp.task("default", gulp.series("mocha"));
