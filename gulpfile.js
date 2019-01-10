"use strict";

// deps

	const { join } = require("path");
	const { get } = require("https");
	require("colors");

	// gulp
	const gulp = require("gulp");

// private

	// methods

		/**
		* Formate string with left padder
		* @param {string} msg : string to pad
		* @param {number} maxSize : pad's occurences number
		* @param {string} padder : padder
		* @returns {Promise} : Formated string
		*/
		function _padleft (msg, maxSize, padder) {

			const PADDER = "string" === typeof padder ? padder : " ";

			let result = "string" === typeof msg ? msg : String(msg);

				for (let currentSize = result.length; currentSize < maxSize; ++currentSize) {
					result = PADDER + result;
				}

			return result;

		}

		/**
		* Formate time for console logging
		* @param {string} msg : string to pad
		* @returns {Promise} : Formated time
		*/
		function _getFormatedTime () {

			const date = new Date();

			return "[".white +
				(
					_padleft(date.getHours(), 2, "0") + ":" +
					_padleft(date.getMinutes(), 2, "0") + ":" +
					_padleft(date.getSeconds(), 2, "0")
				).grey +
			"]".white;

		}

		/**
		* Check dependencies
		* @param {Array} dependencies : dependencies to check
		* @returns {Promise} : Result operation
		*/
		function _checkDependenciesUpdates (dependencies) {

			if (!dependencies.length) {
				return Promise.resolve();
			}
			else {

				const dependency = dependencies.shift();

				// get registery data
				return new Promise((resolve, reject) => {

					get("https://registry.npmjs.org/" + dependency.name, (res) => {

						if (200 !== res.statusCode) {
							res.resume();
							reject(new Error("Impossible to join \"" + dependency.name + "\" registry"));
						}
						else {

							res.setEncoding("utf8");

							let rawData = "";
							res.on("data", (chunk) => {
								rawData += chunk;
							}).on("end", () => {
								resolve(rawData);
							});

						}

					}).on("error", reject);

				// parse registery data
				}).then((data) => {

					return "" === data.trim() ?
						Promise.reject(new Error("\"" + dependency.name + "\" registry does not return data")) :
						Promise.resolve(JSON.parse(data));

				// extract last version
				}).then((data) => {

					return !data["dist-tags"] || !data["dist-tags"].latest ?
						Promise.reject(new Error("\"" + dependency.name + "\" registry does not return latest version")) :
						Promise.resolve(data["dist-tags"].latest);

				// diff
				}).then((latest) => {

					const latestVersions = latest.split(".");
					const versions = dependency.version.split(".");

					if (parseInt(latestVersions[0], 10) > parseInt(versions[0], 10)) {

						(0, console).log(_getFormatedTime(),
							dependency.path, "=>", (dependency.version + " < " + latest).bgRed
						);

					}
					else if (parseInt(latestVersions[1], 10) > parseInt(versions[1], 10)) {

						(0, console).log(_getFormatedTime(),
							dependency.path, "=>", (dependency.version + " < " + latest).red
						);

					}
					else if (parseInt(latestVersions[2], 10) > parseInt(versions[2], 10)) {

						(0, console).log(_getFormatedTime(),
							dependency.path, "=>", (dependency.version + " < " + latest).yellow
						);

					}
					else {

						(0, console).log(_getFormatedTime(), dependency.path, "=>", "Ok".green);

					}

					return !dependencies.length ? Promise.resolve() : _checkDependenciesUpdates(dependencies);

				});

			}

		}

// security

	gulp.task("check-updates", () => {

		// extract deps
		return Promise.resolve().then(() => {

			const packageData = require(join(__dirname, "package.json"));

			const result = [];

				const packageDependencies = packageData.dependencies;
				Object.keys(packageDependencies).forEach((dependency) => {

					result.push({
						"dev": false,
						"name": dependency,
						"version": packageDependencies[dependency]
					});

				});

				const packageDevDependencies = packageData.devDependencies;
				if (packageDevDependencies) {

					Object.keys(packageDevDependencies).forEach((dependency) => {

						result.push({
							"dev": true,
							"name": dependency,
							"version": packageDevDependencies[dependency]
						});

					});

				}

			return Promise.resolve(result);

		// sort deps
		}).then((dependencies) => {

			const result = [];

				dependencies.sort((compared, compareTo) => {

					if (compared.dev && !compareTo.dev) {
						return 1;
					}
					else if (!compared.dev && compareTo.dev) {
						return -1;
					}
						else if (compared.name > compareTo.name) {
							return 1;
						}
						else if (compared.name < compareTo.name) {
							return -1;
						}
							else {
								return 0;
							}

				}).forEach((dependency) => {

					let path = dependency.name;
					path = dependency.dev ? "dev/" + path : path;

					result.push({
						path,
						"name": dependency.name,
						"version": dependency.version
					});

				});

			return Promise.resolve(result);

		// execute task
		}).then((dependencies) => {
			return _checkDependenciesUpdates(dependencies);
		});

	});
