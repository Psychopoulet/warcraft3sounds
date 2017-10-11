/*
	eslint no-loop-func : 0
*/


"use strict";

// deps

	const { join } = require("path");
	const { stat } = require("fs");
	const assert = require("assert");

	const Model = require(join(__dirname, "..", "lib", "api", "model.js"));

// consts

	const SOUNDS_DIRECTORY = join(__dirname, "..", "lib", "public", "sounds");

// module

describe("Sounds", () => {

	let model = null;

	before("should init the model", () => {
		model = new Model();
		return model.init();
	});

	after("should release the model", () => {
		return model.release();
	});

	it("should check sounds existance", () => {

		// if no sound extracted, does not run the test
		return new Promise((resolve) => {

			stat(join(SOUNDS_DIRECTORY, "Human1.mp3"), (err, stats) => {
				resolve(!(err || !stats.isFile()));
			});

		}).then((exists) => {

			return !exists ? Promise.resolve() :
				model.getRaces().then((races) => {

					assert.strictEqual("object", typeof races, "The returned races is not an object");
					assert.strictEqual(true, races instanceof Array, "The returned races is not an Array");
					assert.strictEqual(5, races.length, "The returned races has an invalid length");

					const sounds = [];

					return new Promise((resolve, reject) => {

						const characters = [];

						let done = 0;
						for (let i = 0; i < races.length; ++i) {

							model.getRace(races[i].code).then((race) => {

								race.characters.forEach((character) => {

									characters.push({
										"race": race.code,
										"character": character.code
									});

								});

								race.musics.forEach((music) => {
									sounds.push(join(SOUNDS_DIRECTORY, music.file));
								});

								race.warnings.forEach((music) => {
									sounds.push(join(SOUNDS_DIRECTORY, music.file));
								});

								++done;

								if (done >= races.length) {
									resolve(characters);
								}

							}).catch(reject);

						}

					}).then((characters) => {

						return new Promise((resolve, reject) => {

							let done = 0;
							for (let i = 0; i < characters.length; ++i) {

								model.getCharacter(characters[i].race, characters[i].character).then((character) => {

									character.actions.forEach((action) => {
										sounds.push(join(SOUNDS_DIRECTORY, action.file));
									});

									++done;

									if (done >= characters.length) {
										resolve(characters);
									}

								}).catch(reject);

							}

						});

					}).then(() => {

						return new Promise((resolve, reject) => {

							let done = 0;
							for (let i = 0; i < sounds.length; ++i) {

								stat(sounds[i], (err, stats) => {

									if (err || !stats.isFile()) {
										reject(new Error("\"" + sounds[i] + "\" does not exist"));
									}
									else {

										++done;

										if (done >= sounds.length) {
											resolve();
										}

									}

								});

							}

						});

					});

				});

		});

	});

});
