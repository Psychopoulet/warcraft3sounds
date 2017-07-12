
// deps

	const path = require("path");
	const fs = require("fs");
	const sqlite3 = require("sqlite3").verbose();
	
// consts

	const db = new sqlite3.Database(':memory:');
	const EXPORT_DIR = path.join(__dirname, "..", "fr");

// modules

	// open db
	return new Promise((resolve) => {
		db.serialize(resolve);

	// read file
	}).then(() => {

		return new Promise((resolve, reject) => {

			fs.readFile(path.join(__dirname, "create.sql"), "utf8", (err, content) =>  {

				if (err) {
					reject(err);
				}
				else {

					let result = [];

						content.split(";").forEach((request) => {

							request = request
										.trim()
										.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
										.replace(/\t/g, "")
										.split("\n").filter((line) => {
											return "" !== line.trim() && "--" !== line.substring(0, 2);
										}).join(" ").trim();

							if ("" !== request) {
								result.push(request + ";");
							}
							
						});

					resolve(result);

				}

			});

		});

	// execute requests
	}).then((queries) => {

		function execQuery(i) {

			if (i >= queries.length) {
				return Promise.resolve();
			}
			else {

				return new Promise((resolve, reject) => {

					db.run(queries[i], (err) => {

						if (err) {
							reject(err);
						}
						else {
							resolve();
						}
						
					});

				}).then(() => {
					return execQuery(i+1);
				});
				
			}

		}

		return execQuery(0);

	// SQL to JSON
	}).then(() => {

		console.log("");
		console.log("create db : OK");

		let _actionsTypes = [];
		let _races = [];
			let _characters = [];
				let _actions = [];
			let _musics = [];
			let _warnings = [];

		// actions_types
		return new Promise((resolve, reject) => {

			db.all("SELECT id, code, name FROM actions_types", (err, data) => {

				if (err) {
					reject(err);
				}
				else {
					_actionsTypes = data; resolve();
				}

			});

		// races
		}).then(() => {

			return new Promise((resolve, reject) => {

				db.all("SELECT id, code, name FROM races", (err, data) => {

					if (err) {
						reject(err);
					}
					else {
						_races = data; resolve();
					}

				});

			});

		// characters
		}).then(() => {

			return new Promise((resolve, reject) => {

				db.all("SELECT id, k_race, code, name, tft FROM characters", (err, data) => {

					if (err) {
						reject(err);
					}
					else {
						_characters = data; resolve();
					}

				});

			});

		// musics
		}).then(() => {

			return new Promise((resolve, reject) => {

				db.all("SELECT id, k_race, code, name, file FROM musics", (err, data) => {

					if (err) {
						reject(err);
					}
					else {
						_musics = data; resolve();
					}

				});

			});

		// warnings
		}).then(() => {

			return new Promise((resolve, reject) => {

				db.all("SELECT id, k_race, code, name, file FROM warnings", (err, data) => {

					if (err) {
						reject(err);
					}
					else {
						_warnings = data; resolve();
					}

				});

			});

		// actions
		}).then(() => {

			return new Promise((resolve, reject) => {

				db.all("SELECT id, k_character, k_action_type, code, name, file FROM actions", (err, data) => {

					if (err) {
						reject(err);
					}
					else {
						_actions = data; resolve();
					}

				});

			});

		// formate
		}).then(() => {

			let data = [];

				_races.forEach((race) => {

					let raceCharacters = [];

					_characters.forEach((character) => {

						if (character.k_race === race.id) {

							let raceCharacterActions = [];

							_actions.forEach((action) => {

								if (action.k_character === character.id) {

									let type = "";

									for (let i = 0; i < _actionsTypes.length; ++i) {

										if (_actionsTypes[i].id === action.k_action_type) {
											type = _actionsTypes[i]; break;
										}

									}

									raceCharacterActions.push({
										type: {
											code: type.code,
											name: type.name
										},
										code: action.code,
										name: action.name,
										file: action.file
									});

								}

							});

							raceCharacters.push({
								code: character.code,
								name: character.name,
								actions: raceCharacterActions
							});

						}

					});

					let raceMusics = [];

					_musics.forEach((music) => {

						if (music.k_race === race.id) {

							raceMusics.push({
								code: music.code,
								name: music.name,
								file: music.file
							});

						}

					});

					let raceWarnings = [];

					_warnings.forEach((warning) => {

						if (warning.k_race === race.id) {

							raceWarnings.push({
								code: warning.code,
								name: warning.name,
								file: warning.file
							});

						}

					});

					data.push({
						code: race.code,
						name: race.name,
						characters: raceCharacters,
						musics: raceMusics,
						warnings: raceWarnings
					});

				});

			return Promise.resolve(data);

		});

	// JSON to file
	}).then((races) => {

		function saveRace(i) {

			if (i >= races.length) {
				return Promise.resolve();
			}
			else {

				return new Promise((resolve, reject) => {

					fs.writeFile(path.join(EXPORT_DIR, races[i].code + ".json"), JSON.stringify(races[i]), (err) => {

						if (err) {
							reject(err);
						}
						else {
							resolve();
						}
						
					});

				}).then(() => {
					return saveRace(i+1);
				});
				
			}

		}

		return saveRace(0);

	}).then(() => {

		console.log("create files : OK");
		console.log("");

		db.close();

	}).catch((err) => {

		console.log("");
		console.log(err);
		console.log("");

		db.close();

	});
	 