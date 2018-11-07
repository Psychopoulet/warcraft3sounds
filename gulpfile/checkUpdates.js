/* eslint func-style: 0 */

"use strict";

// deps

	const { get } = require("https");

	require("colors");
	const formateTime = require(require("path").join(__dirname, "formateTime.js"));

// module

module.exports = (packageAbsoluteFile) => {

	// extract deps
	return Promise.resolve().then(() => {

		const packageData = require(packageAbsoluteFile);

		const result = [];

			Object.keys(packageData.dependencies).sort().forEach((dependency) => {

				result.push({
					"name": dependency,
					"version": packageData.dependencies[dependency]
				});

			});

			Object.keys(packageData.devDependencies).sort().forEach((dependency) => {

				result.push({
					"name": dependency,
					"version": packageData.devDependencies[dependency]
				});

			});

		return Promise.resolve(result);

	// execute task
	}).then((dependencies) => {

		return new Promise((resolve, reject) => {

			const executeFirstCheck = () => {

				if (!dependencies.length) {
					(0, console).log("");
					resolve();
				}
				else {

					const dependency = dependencies.shift();

					// get registery data
					new Promise((_resolve, _reject) => {

						get("https://registry.npmjs.org/" + dependency.name, (res) => {

							if (200 !== res.statusCode) {
								res.resume();
								_reject(new Error("Impossible to join \"" + dependency.name + "\" registry"));
							}
							else {

								res.setEncoding("utf8");

								let rawData = "";
								res.on("data", (chunk) => {
									rawData += chunk;
								}).on("end", () => {
									_resolve(rawData);
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

						if (latestVersions[0] > versions[0]) {

							(0, console).log(formateTime(),
								"/!\\".red, dependency.name, "=>",
								dependency.version + " < " + latest
							);

						}
						else if (latestVersions[0] === versions[0] && latestVersions[1] > versions[1]) {

							(0, console).log(formateTime(),
								"/!\\".yellow, dependency.name, "=>",
								dependency.version + " < " + latest
							);

						}
						else if (latestVersions[0] === versions[0] && latestVersions[1] === versions[1] && latestVersions[2] > versions[2]) {

							(0, console).log(formateTime(),
								"/!\\", dependency.name, "=>",
								dependency.version + " < " + latest
							);

						}
						else {

							(0, console).log(formateTime(), dependency.name, "=>", "Ok");

						}

						executeFirstCheck();

					}).catch(reject);

				}

			};

			executeFirstCheck();

		});

	});

};
