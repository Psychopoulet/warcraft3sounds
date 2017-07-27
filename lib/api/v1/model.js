
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

								if (err) {
									reject(err);
								}
								else {
									resolve();
								}

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

				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}

			});

		});

	}

	getRace (code) {

		return new Promise((resolve, reject) => {

			this.db.get(
				"SELECT id, code, name FROM races WHERE code = ? ORDER BY name;"
			, [ code ], (err, data) => {

				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}

			});

		}).then((race) => {

			let result = Promise.resolve(null);

				if (race) {

					const resultData = {
						"characters": [],
						"code": race.code,
						"musics": [],
						"name": race.name,
						"warnings": []
					};

					result = new Promise((resolve, reject) => {

						this.db.all("SELECT code, name FROM characters WHERE k_race = ? ORDER BY name;"
						, [ race.id ], (err, data) => {

							if (err) {
								reject(err);
							}
							else {
								resultData.characters = data;
								resolve();
							}

						});

					}).then(() => {

						return new Promise((resolve, reject) => {

							this.db.all("SELECT code, name, file FROM musics WHERE k_race = ? ORDER BY name;"
							, [ race.id ], (err, data) => {

								if (err) {
									reject(err);
								}
								else {
									resultData.musics = data;
									resolve();
								}

							});

						});

					}).then(() => {

						return new Promise((resolve, reject) => {

							this.db.all("SELECT code, name, file FROM warnings WHERE k_race = ? ORDER BY name;"
							, [ race.id ], (err, data) => {

								if (err) {
									reject(err);
								}
								else {
									resultData.warnings = data;
									resolve();
								}

							});

						});

					}).then(() => {
						return Promise.resolve(resultData);
					});

				}

			return result;

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

				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}

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
							" SELECT actions.code, actions.name, actions.file, actions.file, actions_types.code AS type_code, actions_types.name AS type_name" +
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

				if (err) {
					reject(err);
				}
				else {
					resolve();
				}

			});

		});

	}

};
