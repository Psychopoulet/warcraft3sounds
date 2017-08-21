
"use strict";

// deps

	const { join } = require("path");
	const { spawn } = require("child_process");
	const http = require("http");
	const fs = require("fs");
	const assert = require("assert");

// consts

	const MAX_TIMEOUT_REQUEST = 3000;

	const PORT = "3000";
	const MAIN_URL = "http://127.0.0.1:" + PORT + "/";

// module

describe("server (address 127.0.0.1 on port " + PORT + ")", () => {

	let _serverProcess = null;

	/**
	* Kill the server's process
	* @returns {void}
	*/
	function _killServerProcess () {

		return Promise.resolve().then(() => {

			if (_serverProcess) {
				_serverProcess.stdin.pause();
				_serverProcess.stderr.pause();
				_serverProcess.kill();
				_serverProcess = null;
			}

			return Promise.resolve();

		});

	}

	after(() => {
		return _killServerProcess();
	});

	it("should run the server", () => {

		return new Promise((resolve, reject) => {

			let err = "";

			_serverProcess = spawn(
				"node", [
					join(__dirname, "..", "lib", "main.js"),
					"--port",
					PORT
				], {
					"cwd": join(__dirname, "..")
				}
			);

			_serverProcess.on("error", (_err) => {
				err = "";
				reject(_err);
			}).on("close", (code) => {

				if (code) {
					if (err) {
						reject(new Error(err));
					}
				}

			});

			_serverProcess.stderr.on("data", (data) => {
				err += data.toString("utf8");
			});

			setTimeout(() => {

				if (!err) {
					resolve();
				}

			}, 1000);

		}).catch((err) => {

			return _killServerProcess().then(() => {
				return Promise.reject(err);
			});

		});

	}).timeout(5000);

	it("should get the main page (" + MAIN_URL + ")", () => {

		return new Promise((resolve) => {

			http.get(MAIN_URL, (res) => {

				assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
				assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
				assert.strictEqual("object", typeof res.headers, "The headers are not an object");
				assert.strictEqual(
					"text/html; charset=utf-8",
					res.headers["content-type"].toLowerCase(),
					"The content-type header are not html/utf8"
				);

				res.setEncoding("utf8");

				let rawData = "";

				res.on("data", (chunk) => {
					rawData += chunk;
				}).on("end", () => {

					assert.strictEqual("string", typeof rawData, "The returned content is not a text");

					fs.readFile(join(__dirname, "..", "lib", "web", "index.html"), "utf8", (err, content) => {

						assert.strictEqual(null, err, "The returned content's generate an error");
						assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

						resolve();

					});

				});

			});

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

	it("should get the IPs recovery (" + MAIN_URL + "ips)", () => {

		return new Promise((resolve) => {

			http.get(MAIN_URL + "ips", (res) => {

				assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
				assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
				assert.strictEqual("object", typeof res.headers, "The headers are not an object");
				assert.strictEqual(
					"application/json; charset=utf-8",
					res.headers["content-type"].toLowerCase(),
					"The content-type header are not html/utf8"
				);

				res.setEncoding("utf8");

				let rawData = "";

				res.on("data", (chunk) => {
					rawData += chunk;
				}).on("end", () => {

					assert.strictEqual("string", typeof rawData, "The the returned content is not a string");

					assert.doesNotThrow(() => {
						JSON.parse(rawData);
					}, "The the returned content is not a JSON");

					resolve();

				});

			});

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

	describe("API V1", () => {

		// const API_V1_URL = MAIN_URL + "api/v1/";

		// describe("Model", () => {

		// 	const Model = require(join(__dirname, "..", "lib", "api", "v1", "model.js"));

		// });

		// describe("routes", () => {

		// });

	});

});
