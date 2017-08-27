
"use strict";

// deps

	const path = require("path");
	const fs = require("fs");

	const sqlite3 = require("sqlite3").verbose();

// module

module.exports = class WarcraftSoundsAPIV1Model {

	constructor () {
		this.db = new sqlite3.Database(":memory:");
	}

	init () {

		// open db
		return new Promise((resolve) => {
			this.db.serialize(resolve);

		// read file
		}).then(() => {

			return new Promise((resolve, reject) => {

				fs.readFile(path.join(__dirname, "data", "create.sql"), "utf8", (err, content) => {

					if (err) {
						reject(err);
					}
					else {

						const result = [];

							content.split(";").forEach((request) => {

								const data = request
											.trim()
											.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
											.replace(/\t/g, "")
											.split("\n")
											.filter((line) => {
												return "" !== line.trim() && "--" !== line.substring(0, 2);
											})
											.join(" ")
											.trim();

								if ("" !== data) {
									result.push(data + ";");
								}

							});

						resolve(result);

					}

				});

			});

		// execute requests
		}).then((queries) => {

			/**
			* Execute queries one after one
			* @param {database} db : Database used
			* @param {number} i : Query iteraction
			* @returns {Promise} A Promise instance
			*/
			function execQuery (db, i) {

				let result = Promise.resolve();

					if (i < queries.length) {

						result = new Promise((resolve, reject) => {

							db.run(queries[i], (err) => {
								return err ? reject(err) : resolve();
							});

						}).then(() => {
							return execQuery(db, i + 1);
						});

					}

				return result;

			}

			return execQuery(this.db, 0);

		});

	}

	getRaces () {

		return new Promise((resolve, reject) => {

			this.db.all("SELECT code, name FROM races ORDER BY name;", (err, data) => {
				return err ? reject(err) : resolve(data);
			});

		});

	}

	getRace (code) {

		return new Promise((resolve, reject) => {

			this.db.all(
				" SELECT" +
					" races.id AS race_id, races.code AS race_code, races.name AS race_name," +
					" characters.code AS character_code, characters.name AS character_name," +
					" musics.code AS music_code, musics.name AS music_name," +
					" warnings.code AS warning_code, warnings.name AS warning_name" +
				" FROM races" +
					" LEFT JOIN characters ON characters.k_race = races.id" +
					" LEFT JOIN musics ON musics.k_race = races.id" +
					" LEFT JOIN warnings ON warnings.k_race = races.id" +
				" WHERE races.code = ?" +
				" ORDER BY races.name, characters.name, musics.name, warnings.name;"
			, [ code ], (err, data) => {
				return err ? reject(err) : resolve(data);
			});

		}).then((raceData) => {

			if (!raceData) {
				return Promise.resolve(null);
			}
			else {

				const result = {
					"code": raceData[0].race_code,
					"name": raceData[0].race_name,
					"characters": [],
					"musics": [],
					"warnings": []
				};

				raceData.forEach((data) => {

					let characterFound = false;
					for (let i = 0; i < result.characters.length; ++i) {

						if (result.characters[i].code === data.character_code) {
							characterFound = true; break;
						}

					}

					if (!characterFound) {

						result.characters.push({
							"code": data.character_code,
							"name": data.character_name
						});

					}

					let musicFound = false;
					for (let i = 0; i < result.musics.length; ++i) {

						if (result.musics[i].code === data.music_code) {
							musicFound = true; break;
						}

					}

					if (!musicFound) {

						result.musics.push({
							"code": data.music_code,
							"name": data.music_name
						});

					}

					let warningFound = false;
					for (let i = 0; i < result.warnings.length; ++i) {

						if (result.warnings[i].code === data.warning_code) {
							warningFound = true; break;
						}

					}

					if (!warningFound) {

						result.warnings.push({
							"code": data.warning_code,
							"name": data.warning_name
						});

					}

				});

				return Promise.resolve(result);

			}

		});

	}

	getCharacter (codeRace, code) {

		return new Promise((resolve, reject) => {

			this.db.get(
				" SELECT characters.id, characters.code, characters.name" +
				" FROM characters INNER JOIN races ON races.id = characters.k_race" +
				" WHERE races.code = ? AND characters.code = ?" +
				" ORDER BY characters.name;"
			, [ codeRace, code ], (err, data) => {
				return err ? reject(err) : resolve(data);
			});

		}).then((character) => {

			const result = Promise.resolve(null);

				if (character) {

					const resultData = {
						"actions": [],
						"code": character.code,
						"name": character.name
					};

					return new Promise((resolve, reject) => {

						this.db.all(
							" SELECT " +
								" actions.code, actions.name, actions.file, actions.file," +
								" actions_types.code AS type_code, actions_types.name AS type_name" +
							" FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type" +
							" WHERE actions.k_character = ?;"
						, [ character.id ], (err, data) => {

							if (err) {
								reject(err);
							}
							else {

								data.forEach((action) => {

									resultData.actions.push({
										"code": action.code,
										"file": action.file,
										"name": action.name,
										"type": {
											"code": action.type_code,
											"name": action.type_name
										}
									});

								});

								resolve();

							}

						});

					}).then(() => {
						return Promise.resolve(resultData);
					});

				}

			return result;

		});

	}

	release () {

		return new Promise((resolve, reject) => {

			this.db.close((err) => {
				return err ? reject(err) : resolve();
			});

		});

	}

};
