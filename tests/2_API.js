
"use strict";

// deps

	const { join } = require("path");
	const http = require("http");
	const assert = require("assert");

	const checksum = require("checksum");

	const Model = require(join(__dirname, "..", "lib", "api", "model.js"));

	const generateServer = require(join(__dirname, "..", "lib", "server", "generateServer.js"));
	const webRoutes = require(join(__dirname, "..", "lib", "server", "webRoutes.js"));
	const apiRoutes = require(join(__dirname, "..", "lib", "api", "routes.js"));

// consts

	const PORT = "3000";
	const MAIN_URL = "http://127.0.0.1:" + PORT + "/";

// module

describe("API", () => {

	it("should check checksum", () => {

		return Promise.resolve().then(() => {

			return Promise.resolve(checksum("test", {
				"algorithm": "sha256"
			}));

		}).then((sum) => {

			assert.deepStrictEqual("string", typeof sum, "Check \"test\" parameter does not generate a valid checksum");
			assert.deepStrictEqual(
				"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
				sum,
				"Check \"test\" valid file parameter does not generate a valid checksum"
			);

			return Promise.resolve();

		});

	});

	describe("Model", () => {

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

		const API_URL = MAIN_URL + "api/";

		let server = null;

		beforeEach(() => {

			return generateServer().then((APP) => {

				return webRoutes(APP).then(() => {
					return Promise.resolve(APP);
				});

			}).then((APP) => {

				return apiRoutes(APP).then(() => {
					return Promise.resolve(APP);
				});

			}).then((APP) => {

				return new Promise((resolve) => {

					server = APP.listen(PORT, () => {
						resolve(APP);
					});

				});

			});

		});

		afterEach(() => {

			return new Promise((resolve) => {

				server.close(() => {
					server = null;
					resolve();
				});

			});

		});

		it("should get the IPs recovery (" + API_URL + "ips)", () => {

			return new Promise((resolve) => {

				http.get(API_URL + "ips", (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"application/json; charset=utf-8",
						res.headers["content-type"].toLowerCase(),
						"The content-type header are not json/utf8"
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

		});

		it("should test error (" + API_URL + "err)", () => {

			return new Promise((resolve) => {

				http.get(API_URL + "err", (res) => {

					assert.strictEqual(500, res.statusCode, "The statusCode is not 500");
					assert.strictEqual("Internal Server Error", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"application/json; charset=utf-8",
						res.headers["content-type"].toLowerCase(),
						"The content-type header are not json/utf8"
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

		});

		describe("races", () => {

			it("should get the races (" + API_URL + "races)", () => {

				return new Promise((resolve) => {

					http.get(API_URL + "races", (res) => {

						assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
						assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
						assert.strictEqual("object", typeof res.headers, "The headers are not an object");
						assert.strictEqual(
							"application/json; charset=utf-8",
							res.headers["content-type"].toLowerCase(),
							"The content-type header are not json/utf8"
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

							const data = JSON.parse(rawData);

							assert.strictEqual(5, data.length, "The returned data does not have the right length");
							assert.strictEqual("nightelfs", data[0].code, "The first returned data does not have the right value");
							assert.strictEqual("Elfes de la nuit", data[0].name, "The first returned data does not have the right value");
							assert.strictEqual("/api/races/nightelfs", data[0].url, "The first returned data does not have the right value");

							resolve();

						});

					});

				});

			});

			it("should get an unknown race (" + API_URL + "races/test)", () => {

				return new Promise((resolve) => {

					http.get(API_URL + "races/test", (res) => {

						assert.strictEqual(404, res.statusCode, "The statusCode is not 404");
						assert.strictEqual("Not Found", res.statusMessage, "The statusMessage is not valid");
						assert.strictEqual("object", typeof res.headers, "The headers are not an object");
						assert.strictEqual(
							"application/json; charset=utf-8",
							res.headers["content-type"].toLowerCase(),
							"The content-type header are not json/utf8"
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

							const data = JSON.parse(rawData);

							assert.strictEqual("object", typeof data, "The returned data are not an object");
							assert.strictEqual("number", typeof data.code, "The returned code are not an object");
							assert.strictEqual(404, data.code, "The returned code are not as expected");
							assert.strictEqual("string", typeof data.message, "The returned message are not an object");
							assert.strictEqual("Impossible to find \"test\"", data.message, "The returned message are not as expected");

							resolve();

						});

					});

				});

			});

			it("should get a valid race (" + API_URL + "races/nightelfs)", () => {

				return new Promise((resolve) => {

					http.get(API_URL + "races/nightelfs", (res) => {

						assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
						assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
						assert.strictEqual("object", typeof res.headers, "The headers are not an object");
						assert.strictEqual(
							"application/json; charset=utf-8",
							res.headers["content-type"].toLowerCase(),
							"The content-type header are not json/utf8"
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

							const data = JSON.parse(rawData);

							assert.strictEqual("object", typeof data, "The returned data are not an object");
							assert.strictEqual("nightelfs", data.code, "The returned data does not have the right code");
							assert.strictEqual("Elfes de la nuit", data.name, "The returned data does not have the right name");

							assert.strictEqual("object", typeof data.characters, "The returned data does not have valid characters");
							assert.strictEqual(true, data.characters instanceof Array, "The returned data does not have valid characters");

								assert.strictEqual(true, 0 < data.characters.length, "The returned data does not have characters");
								assert.strictEqual("archer", data.characters[0].code, "The first character does not have valid code");
								assert.strictEqual("Archer", data.characters[0].name, "The first character does not have valid name");
								assert.strictEqual(
									"/api/races/nightelfs/characters/archer",
									data.characters[0].url,
									"The first character does not have valid url"
								);

							assert.strictEqual("object", typeof data.musics, "The returned data does not have valid musics");
							assert.strictEqual(true, data.musics instanceof Array, "The returned data does not have valid musics");

								assert.strictEqual(true, 0 < data.musics.length, "The returned data does not have musics");
								assert.strictEqual("defeat", data.musics[0].code, "The first music does not have valid code");
								assert.strictEqual("Défaite", data.musics[0].name, "The first music does not have valid name");
								assert.strictEqual(
									"/public/sounds/NightElfDefeat.mp3",
									data.musics[0].url,
									"The first music does not have valid url"
								);

							assert.strictEqual("object", typeof data.warnings, "The returned data does not have valid warnings");
							assert.strictEqual(true, data.warnings instanceof Array, "The returned data does not have valid warnings");

								assert.strictEqual(true, 0 < data.warnings.length, "The returned data does not have warnings");
								assert.strictEqual("upgradecomplete", data.warnings[0].code, "The first warning does not have valid code");
								assert.strictEqual("Amélioration terminée", data.warnings[0].name, "The first warning does not have valid name");
								assert.strictEqual(
									"/public/sounds/SentinelUpgradeComplete1.wav",
									data.warnings[0].url,
									"The first warning does not have valid url"
								);

							resolve();

						});

					});

				});

			});

			describe("characters", () => {

				it("should get an unknown character (" + API_URL + "races/humans/characters/test)", () => {

					return new Promise((resolve) => {

						http.get(API_URL + "races/humans/characters/test", (res) => {

							assert.strictEqual(404, res.statusCode, "The statusCode is not 404");
							assert.strictEqual("Not Found", res.statusMessage, "The statusMessage is not valid");
							assert.strictEqual("object", typeof res.headers, "The headers are not an object");
							assert.strictEqual(
								"application/json; charset=utf-8",
								res.headers["content-type"].toLowerCase(),
								"The content-type header are not json/utf8"
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

								const data = JSON.parse(rawData);

								assert.strictEqual("object", typeof data, "The returned data are not an object");
								assert.strictEqual("number", typeof data.code, "The returned code are not an object");
								assert.strictEqual(404, data.code, "The returned code are not as expected");
								assert.strictEqual("string", typeof data.message, "The returned message are not an object");
								assert.strictEqual(
									"Impossible to find \"test\" for race \"humans\"",
									data.message,
									"The returned message are not as expected"
								);

								resolve();

							});

						});

					});

				});

				it("should get a valid character (" + API_URL + "races/humans/characters/knight)", () => {

					return new Promise((resolve) => {

						http.get(API_URL + "races/humans/characters/knight", (res) => {

							assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
							assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
							assert.strictEqual("object", typeof res.headers, "The headers are not an object");
							assert.strictEqual(
								"application/json; charset=utf-8",
								res.headers["content-type"].toLowerCase(),
								"The content-type header are not json/utf8"
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

								const data = JSON.parse(rawData);

								assert.strictEqual("object", typeof data, "The returned data are not an object");
								assert.strictEqual("knight", data.code, "The returned data does not have the right code");
								assert.strictEqual("Chevalier", data.name, "The returned data does not have the right name");

								assert.strictEqual("object", typeof data.actions, "The returned data does not have valid actions");
								assert.strictEqual(true, data.actions instanceof Array, "The returned data does not have valid actions");

									assert.strictEqual(true, 0 < data.actions.length, "The returned data does not have actions");
									assert.strictEqual("ready1", data.actions[0].code, "The first action does not have valid code");
									assert.strictEqual("J'attend vos ordres", data.actions[0].name, "The first action does not have valid name");
									assert.strictEqual("KnightReady1.wav", data.actions[0].file, "The first action does not have valid file");
									assert.strictEqual(
										"/public/sounds/KnightReady1.wav",
										data.actions[0].url,
										"The first action does not have valid url"
									);

									assert.strictEqual("object", typeof data.actions[0].type, "The first action does not have valid type");

										assert.strictEqual("ready", data.actions[0].type.code, "The first action type does not have valid code");
										assert.strictEqual("Prêt !", data.actions[0].type.name, "The first action type does not have valid name");

								resolve();

							});

						});

					});

				});

			});

		});

	});

});
