
"use strict";

// deps

	const { join } = require("path");
	const { spawn } = require("child_process");
	const http = require("http");
	const assert = require("assert");

	const checksum = require(join(__dirname, "..", "lib", "api", "checksum.js"));

// consts

	const MAX_TIMEOUT_REQUEST = 3000;

	const PORT = "3000";
	const MAIN_URL = "http://127.0.0.1:" + PORT + "/";

// module

describe("API V1", () => {

	describe("chechsum", () => {

		it("should check missing file parameter", (done) => {

			checksum().then(() => {
				done(new Error("Check missing file parameter does not generate any error"));
			}).catch((err) => {

				assert.deepStrictEqual("object", typeof err, "Check missing file parameter does not generate a valid error");
				assert.deepStrictEqual(true, err instanceof Error, "Check missing file parameter does not generate a valid error");

				done();

			});

		});

		it("should check wrong file parameter", (done) => {

			checksum(false).then(() => {
				done(new Error("Check wrong file parameter does not generate any error"));
			}).catch((err) => {

				assert.deepStrictEqual("object", typeof err, "Check wrong file parameter does not generate a valid error");
				assert.deepStrictEqual(true, err instanceof Error, "Check wrong file parameter does not generate a valid error");

				done();

			});

		});

		it("should check empty file parameter", (done) => {

			checksum("").then(() => {
				done(new Error("Check empty file parameter does not generate any error"));
			}).catch((err) => {

				assert.deepStrictEqual("object", typeof err, "Check empty file parameter does not generate a valid error");
				assert.deepStrictEqual(true, err instanceof Error, "Check empty file parameter does not generate a valid error");

				done();

			});

		});

		it("should check valid file parameter", () => {

			const fileCheckSum = join(__dirname, "..", "lib", "api", "checksum.js");

			return checksum(fileCheckSum).then((data) => {

				assert.deepStrictEqual("string", typeof data, "Check \"" + fileCheckSum + "\" file parameter does not generate a valid checksum");
				assert.deepStrictEqual(
					"19ab4f7ec8c5934c0657200696804e03189f5549",
					data,
					"Check \"" + fileCheckSum + "\" valid file parameter does not generate a valid checksum"
				);

				return Promise.resolve();

			});

		});

	});

	describe("Model", () => {

		const Model = require(join(__dirname, "..", "lib", "api", "model.js"));
		const model = new Model();

		it("should init the model", () => {
			return model.init();
		});

		it("should get races", () => {

			return model.getRaces().then((races) => {

				assert.strictEqual("object", typeof races, "The returned races is not an object");
				assert.strictEqual(true, races instanceof Array, "The returned races is not an Array");
				assert.strictEqual(5, races.length, "The returned races has an invalid length");

				return Promise.resolve();

			});

		});

		it("should get unknown race", () => {

			return model.getRace("qcqdvsvdsrsv").then((race) => {

				assert.strictEqual(null, race, "The returned race is not null");

				return Promise.resolve();

			});

		});

		it("should get race", () => {

			return model.getRace("humans").then((race) => {

				assert.strictEqual("object", typeof race, "The returned race is not an object");
					assert.strictEqual("string", typeof race.code, "The returned race's code is not a string");
					assert.strictEqual("string", typeof race.name, "The returned race's name is not a string");
					assert.strictEqual("object", typeof race.characters, "The returned race's characters is not an object");
					assert.strictEqual(true, race.characters instanceof Array, "The returned race's characters is not an Array");
					assert.strictEqual("object", typeof race.musics, "The returned race's musics is not an object");
					assert.strictEqual(true, race.musics instanceof Array, "The returned race's musics is not an Array");
					assert.strictEqual("object", typeof race.warnings, "The returned race's warnings is not an object");
					assert.strictEqual(true, race.warnings instanceof Array, "The returned race's warnings is not an Array");

				return Promise.resolve();

			});

		});

		it("should get unknown character", () => {

			return model.getCharacter("humans", "qcqdvsvdsrsv").then((character) => {

				assert.strictEqual(null, character, "The returned character is not null");

				return Promise.resolve();

			});

		});

		it("should get character", () => {

			return model.getCharacter("humans", "archmage").then((character) => {

				assert.strictEqual("object", typeof character, "The returned character is not an object");
					assert.strictEqual("string", typeof character.code, "The returned character's code is not a string");
					assert.strictEqual("string", typeof character.name, "The returned character's name is not a string");
					assert.strictEqual("object", typeof character.actions, "The returned character's actions is not an object");
					assert.strictEqual(true, character.actions instanceof Array, "The returned character's actions is not an Array");

				return Promise.resolve();

			});

		});

		it("should release the model", () => {
			return model.release();
		});

	});

	describe("routes", () => {

		const API_V1_URL = MAIN_URL + "api/fr/";

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

				_serverProcess.stdout.on("data", (data) => {

					if ("started on port " + PORT === data.toString("utf8").trim()) {
						resolve();
					}

				});

				_serverProcess.stderr.on("data", (data) => {
					err += data.toString("utf8");
				});

			}).catch((err) => {

				return _killServerProcess().then(() => {
					return Promise.reject(err);
				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

		it("should get the races (" + API_V1_URL + "races)", () => {

			return new Promise((resolve) => {

				http.get(API_V1_URL + "races", (res) => {

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

						assert.strictEqual("string", typeof rawData, "The returned content is not a string");

						assert.doesNotThrow(() => {
							JSON.parse(rawData);
						}, "The returned content is not a JSON");

						resolve();

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

	});

});
