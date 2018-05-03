
"use strict";

// deps

	const { join } = require("path");
	const { get } = require("http");
	const { doesNotThrow, strictEqual } = require("assert");

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

			strictEqual(typeof sum, "string", "Check \"test\" parameter does not generate a valid checksum");
			strictEqual(
				sum,
				"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
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

				strictEqual(typeof races, "object", "The returned races is not an object");
				strictEqual(races instanceof Array, true, "The returned races is not an Array");
				strictEqual(races.length, 5, "The returned races has an invalid length");

				return Promise.resolve();

			});

		});

		it("should get unknown race", () => {

			return model.getRace("qcqdvsvdsrsv").then((race) => {

				strictEqual(race, null, "The returned race is not null");

				return Promise.resolve();

			});

		});

		it("should get race", () => {

			return model.getRace("humans").then((race) => {

				strictEqual(typeof race, "object", "The returned race is not an object");
					strictEqual(typeof race.code, "string", "The returned race's code is not a string");
					strictEqual(typeof race.name, "string", "The returned race's name is not a string");
					strictEqual(typeof race.characters, "object", "The returned race's characters is not an object");
					strictEqual(race.characters instanceof Array, true, "The returned race's characters is not an Array");
					strictEqual(typeof race.musics, "object", "The returned race's musics is not an object");
					strictEqual(race.musics instanceof Array, true, "The returned race's musics is not an Array");
					strictEqual(typeof race.warnings, "object", "The returned race's warnings is not an object");
					strictEqual(race.warnings instanceof Array, true, "The returned race's warnings is not an Array");

				return Promise.resolve();

			});

		});

		it("should get unknown character", () => {

			return model.getCharacter("humans", "qcqdvsvdsrsv").then((character) => {

				strictEqual(character, null, "The returned character is not null");

				return Promise.resolve();

			});

		});

		it("should get character", () => {

			return model.getCharacter("humans", "archmage").then((character) => {

				strictEqual(typeof character, "object", "The returned character is not an object");
					strictEqual(typeof character.code, "string", "The returned character's code is not a string");
					strictEqual(typeof character.name, "string", "The returned character's name is not a string");
					strictEqual(typeof character.actions, "object", "The returned character's actions is not an object");
					strictEqual(character.actions instanceof Array, true, "The returned character's actions is not an Array");

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

				get(API_URL + "ips", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"application/json; charset=utf-8",
						"The content-type header are not json/utf8"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The the returned content is not a string");

						doesNotThrow(() => {
							JSON.parse(rawData);
						}, "The the returned content is not a JSON");

						resolve();

					});

				});

			});

		});

		it("should test error (" + API_URL + "err)", () => {

			return new Promise((resolve) => {

				get(API_URL + "err", (res) => {

					strictEqual(res.statusCode, 500, "The statusCode is not 500");
					strictEqual(res.statusMessage, "Internal Server Error", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"application/json; charset=utf-8",
						"The content-type header are not json/utf8"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The the returned content is not a string");

						doesNotThrow(() => {
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

					get(API_URL + "races", (res) => {

						strictEqual(res.statusCode, 200, "The statusCode is not 200");
						strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
						strictEqual(typeof res.headers, "object", "The headers are not an object");
						strictEqual(
							res.headers["content-type"].toLowerCase(),
							"application/json; charset=utf-8",
							"The content-type header are not json/utf8"
						);

						res.setEncoding("utf8");

						let rawData = "";

						res.on("data", (chunk) => {
							rawData += chunk;
						}).on("end", () => {

							strictEqual(typeof rawData, "string", "The returned content is not a string");

							doesNotThrow(() => {
								JSON.parse(rawData);
							}, "The returned content is not a JSON");

							const data = JSON.parse(rawData);

							strictEqual(data.length, 5, "The returned data does not have the right length");
							strictEqual(data[0].code, "nightelfs", "The first returned data does not have the right value");
							strictEqual(data[0].name, "Elfes de la nuit", "The first returned data does not have the right value");
							strictEqual(data[0].url, "/api/races/nightelfs", "The first returned data does not have the right value");

							resolve();

						});

					});

				});

			});

			it("should get an unknown race (" + API_URL + "races/test)", () => {

				return new Promise((resolve) => {

					get(API_URL + "races/test", (res) => {

						strictEqual(res.statusCode, 404, "The statusCode is not 404");
						strictEqual(res.statusMessage, "Not Found", "The statusMessage is not valid");
						strictEqual(typeof res.headers, "object", "The headers are not an object");
						strictEqual(
							res.headers["content-type"].toLowerCase(),
							"application/json; charset=utf-8",
							"The content-type header are not json/utf8"
						);

						res.setEncoding("utf8");

						let rawData = "";

						res.on("data", (chunk) => {
							rawData += chunk;
						}).on("end", () => {

							strictEqual(typeof rawData, "string", "The returned content is not a string");

							doesNotThrow(() => {
								JSON.parse(rawData);
							}, "The returned content is not a JSON");

							const data = JSON.parse(rawData);

							strictEqual(typeof data, "object", "The returned data are not an object");
							strictEqual(typeof data.code, "number", "The returned code are not an object");
							strictEqual(data.code, 404, "The returned code are not as expected");
							strictEqual(typeof data.message, "string", "The returned message are not an object");
							strictEqual(data.message, "Impossible to find \"test\"", "The returned message are not as expected");

							resolve();

						});

					});

				});

			});

			it("should get a valid race (" + API_URL + "races/nightelfs)", () => {

				return new Promise((resolve) => {

					get(API_URL + "races/nightelfs", (res) => {

						strictEqual(res.statusCode, 200, "The statusCode is not 200");
						strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
						strictEqual(typeof res.headers, "object", "The headers are not an object");
						strictEqual(
							res.headers["content-type"].toLowerCase(),
							"application/json; charset=utf-8",
							"The content-type header are not json/utf8"
						);

						res.setEncoding("utf8");

						let rawData = "";

						res.on("data", (chunk) => {
							rawData += chunk;
						}).on("end", () => {

							strictEqual(typeof rawData, "string", "The returned content is not a string");

							doesNotThrow(() => {
								JSON.parse(rawData);
							}, "The returned content is not a JSON");

							const data = JSON.parse(rawData);

							strictEqual(typeof data, "object", "The returned data are not an object");
							strictEqual(data.code, "nightelfs", "The returned data does not have the right code");
							strictEqual(data.name, "Elfes de la nuit", "The returned data does not have the right name");

							strictEqual(typeof data.characters, "object", "The returned data does not have valid characters");
							strictEqual(data.characters instanceof Array, true, "The returned data does not have valid characters");

								strictEqual(0 < data.characters.length, true, "The returned data does not have characters");
								strictEqual(data.characters[0].code, "archer", "The first character does not have valid code");
								strictEqual(data.characters[0].name, "Archer", "The first character does not have valid name");
								strictEqual(
									data.characters[0].url,
									"/api/races/nightelfs/characters/archer",
									"The first character does not have valid url"
								);

							strictEqual(typeof data.musics, "object", "The returned data does not have valid musics");
							strictEqual(data.musics instanceof Array, true, "The returned data does not have valid musics");

								strictEqual(0 < data.musics.length, true, "The returned data does not have musics");
								strictEqual(data.musics[0].code, "defeat", "The first music does not have valid code");
								strictEqual(data.musics[0].name, "Défaite", "The first music does not have valid name");
								strictEqual(
									data.musics[0].url,
									"/public/sounds/NightElfDefeat.mp3",
									"The first music does not have valid url"
								);

							strictEqual(typeof data.warnings, "object", "The returned data does not have valid warnings");
							strictEqual(data.warnings instanceof Array, true, "The returned data does not have valid warnings");

								strictEqual(0 < data.warnings.length, true, "The returned data does not have warnings");
								strictEqual(data.warnings[0].code, "upgradecomplete", "The first warning does not have valid code");
								strictEqual(data.warnings[0].name, "Amélioration terminée", "The first warning does not have valid name");
								strictEqual(
									data.warnings[0].url,
									"/public/sounds/SentinelUpgradeComplete1.wav",
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

						get(API_URL + "races/humans/characters/test", (res) => {

							strictEqual(res.statusCode, 404, "The statusCode is not 404");
							strictEqual(res.statusMessage, "Not Found", "The statusMessage is not valid");
							strictEqual(typeof res.headers, "object", "The headers are not an object");
							strictEqual(
								res.headers["content-type"].toLowerCase(),
								"application/json; charset=utf-8",
								"The content-type header are not json/utf8"
							);

							res.setEncoding("utf8");

							let rawData = "";

							res.on("data", (chunk) => {
								rawData += chunk;
							}).on("end", () => {

								strictEqual(typeof rawData, "string", "The returned content is not a string");

								doesNotThrow(() => {
									JSON.parse(rawData);
								}, "The returned content is not a JSON");

								const data = JSON.parse(rawData);

								strictEqual(typeof data, "object", "The returned data are not an object");
								strictEqual(typeof data.code, "number", "The returned code are not an object");
								strictEqual(data.code, 404, "The returned code are not as expected");
								strictEqual(typeof data.message, "string", "The returned message are not an object");
								strictEqual(
									data.message,
									"Impossible to find \"test\" for race \"humans\"",
									"The returned message are not as expected"
								);

								resolve();

							});

						});

					});

				});

				it("should get a valid character (" + API_URL + "races/humans/characters/knight)", () => {

					return new Promise((resolve) => {

						get(API_URL + "races/humans/characters/knight", (res) => {

							strictEqual(res.statusCode, 200, "The statusCode is not 200");
							strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
							strictEqual(typeof res.headers, "object", "The headers are not an object");
							strictEqual(
								res.headers["content-type"].toLowerCase(),
								"application/json; charset=utf-8",
								"The content-type header are not json/utf8"
							);

							res.setEncoding("utf8");

							let rawData = "";

							res.on("data", (chunk) => {
								rawData += chunk;
							}).on("end", () => {

								strictEqual(typeof rawData, "string", "The returned content is not a string");

								doesNotThrow(() => {
									JSON.parse(rawData);
								}, "The returned content is not a JSON");

								const data = JSON.parse(rawData);

								strictEqual(typeof data, "object", "The returned data are not an object");
								strictEqual(data.code, "knight", "The returned data does not have the right code");
								strictEqual(data.name, "Chevalier", "The returned data does not have the right name");

								strictEqual(typeof data.actions, "object", "The returned data does not have valid actions");
								strictEqual(data.actions instanceof Array, true, "The returned data does not have valid actions");

									strictEqual(0 < data.actions.length, true, "The returned data does not have actions");
									strictEqual(data.actions[0].code, "ready1", "The first action does not have valid code");
									strictEqual(data.actions[0].name, "J'attend vos ordres", "The first action does not have valid name");
									strictEqual(data.actions[0].file, "KnightReady1.wav", "The first action does not have valid file");
									strictEqual(
										data.actions[0].url,
										"/public/sounds/KnightReady1.wav",
										"The first action does not have valid url"
									);

									strictEqual(typeof data.actions[0].type, "object", "The first action does not have valid type");

										strictEqual(data.actions[0].type.code, "ready", "The first action type does not have valid code");
										strictEqual(data.actions[0].type.name, "Prêt !", "The first action type does not have valid name");

								resolve();

							});

						});

					});

				});

			});

		});

	});

});
