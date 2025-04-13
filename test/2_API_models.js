
"use strict";

// deps

	// native
	const { join } = require("path");
	const { strictEqual } = require("assert");

	// externals
	const Model = require(join(__dirname, "..", "lib", "api", "model.js"));

// module

describe("API / Model", () => {

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
