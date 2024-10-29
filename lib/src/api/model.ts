// deps

	// natives
	import { join } from "node:path";
	import { readFile } from "node:fs/promises";

	// externals
	import { verbose } from "sqlite3";

// types & interfaces

	// externals
	import type { Database } from "sqlite3";

	// locals

	interface iBasicData {
		"code": string;
		"name": string;
	};

	interface iBasicFileData extends iBasicData {
		"file": string;
	};

	interface iActionData extends iBasicFileData {
		"type": iBasicData;
	};

	interface iRace extends iBasicData {
		"characters": iBasicData[];
		"musics": iBasicFileData[];
		"warnings": iBasicFileData[];
	};

	interface iCharacter extends iBasicData {
		"actions": iActionData[];
	};

// consts

	const sqlite3 = verbose();

// module

export default class WarcraftSoundsModel {

	// attributes

		// private

		private _db: Database;

	// constructor

	public constructor () {

		this._db = new sqlite3.Database(":memory:");

	}

	// methods

	public init (): Promise<void> {

		// open db
		return new Promise((resolve: (value?: unknown) => void): void => {

			this._db.serialize(resolve);

		// read file
		}).then((): Promise<string[]> => {

			return readFile(join(__dirname, "data", "create.sql"), "utf-8").then((content: string): Promise<string> => {

				return readFile(join(__dirname, "data", "toword.sql"), "utf-8").then((contenttoWord: string): string => {

					return content + contenttoWord;

				});

			}).then((content: string): Promise<string[]> => {

				return new Promise((resolve: (value: string[]) => void): void => {

					process.nextTick((): void => {

						const result: string[] = [];

							content.split(";").forEach((request: string): void => {

								const data: string = request
											.trim()
											.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
											.replace(/\t/g, "")
											.split("\n")
											.filter((line: string): boolean => {
												return "" !== line.trim() && "--" !== line.substring(0, 2);
											})
											.join(" ")
											.trim();

								if ("" !== data) {
									result.push(data + ";");
								}

							});

						resolve(result);

					});

				});

			});

		// execute requests
		}).then((queries: string[]): Promise<void> => {

			const _execQuery = (i: number) => {

				return i < queries.length ? new Promise((resolve: (value?: unknown) => void, reject: (err: Error) => void): void => {

					this._db.run(queries[i], (err: Error): void => {
						return err ? reject(err) : resolve();
					});

				}).then((): Promise<void> => {
					return _execQuery(i + 1);
				}) : Promise.resolve();

			}

			return _execQuery(0);

		});

	}

	public release (): Promise<void> {

		return new Promise((resolve: () => void, reject: (err: Error) => void): void => {

			this._db.close((err: Error | null): void => {
				return err ? reject(err) : resolve();
			});

		});

	}

	public getRaces (): Promise<iBasicData[]> {

		return new Promise((resolve: (data: iBasicData[]) => void, reject: (err: Error) => void): void => {

			this._db.all("SELECT code, name FROM races ORDER BY name;", (err: Error | null, data: iBasicData[]): void => {
				return err ? reject(err) : resolve(data);
			});

		});

	}

	public getRace (code: string): Promise<iRace | null> {

		interface iSQLRequestResult {
			"race_id": string;
			"race_code": string;
			"race_name": string;
			"character_code": string;
			"character_name": string;
			"music_code": string;
			"music_name": string;
			"music_file": string;
			"warning_code": string;
			"warning_name": string;
			"warning_file": string;
		}

		return new Promise((resolve: (data: iSQLRequestResult[]) => void, reject: (err: Error) => void) => {

			this._db.all(
				" SELECT" +
					" races.id AS race_id, races.code AS race_code, races.name AS race_name," +
					" characters.code AS character_code, characters.name AS character_name," +
					" musics.code AS music_code, musics.name AS music_name, musics.file AS music_file," +
					" warnings.code AS warning_code, warnings.name AS warning_name, warnings.file AS warning_file" +
				" FROM races" +
					" LEFT JOIN characters ON characters.k_race = races.id" +
					" LEFT JOIN musics ON musics.k_race = races.id" +
					" LEFT JOIN warnings ON warnings.k_race = races.id" +
				" WHERE races.code = ?" +
				" ORDER BY races.name, characters.name, musics.name, warnings.name;"
			, [ code ], (err: Error | null, data: iSQLRequestResult[]): void => {
				return err ? reject(err) : resolve(data);
			});

		}).then((racesData: iSQLRequestResult[]): Promise<iRace | null> => {

			return !racesData || !racesData.length ? Promise.resolve(null) : new Promise((resolve: (data: iRace) => void): void => {

				process.nextTick((): void => {

					const result: iRace = {
						"code": racesData[0].race_code,
						"name": racesData[0].race_name,
						"characters": [],
						"musics": [],
						"warnings": []
					};

					racesData.forEach((data: iSQLRequestResult): void => {

						if (data.character_code) {

							if (-1 === result.characters.findIndex((character: iBasicData): boolean => {
								return character.code === data.character_code;
							})) {

								result.characters.push({
									"code": data.character_code,
									"name": data.character_name
								});

							}

						}

						if (data.music_code) {

							if (-1 === result.musics.findIndex((music: iBasicData): boolean => {
								return music.code === data.music_code;
							})) {

								result.musics.push({
									"code": data.music_code,
									"file": data.music_file,
									"name": data.music_name
								});

							}

						}

						if (data.warning_code) {

							if (-1 === result.warnings.findIndex((warning: iBasicData): boolean => {
								return warning.code === data.warning_code;
							})) {

								result.warnings.push({
									"code": data.warning_code,
									"file": data.warning_file,
									"name": data.warning_name
								});

							}

						}

					});

					return resolve(result);

				});

			});

		});

	}

	public getCharacter (codeRace: string, code: string, notWorded: boolean = false): Promise<iCharacter | null> {

		interface iSQLRequestResult {
			"id": string;
			"code": string;
			"name": string;
		}

		return new Promise((resolve: (data: iSQLRequestResult) => void, reject: (err: Error) => void) => {

			this._db.get(
				" SELECT characters.id, characters.code, characters.name" +
				" FROM characters" +
					" INNER JOIN races ON races.id = characters.k_race" +
				" WHERE" +
					" races.code = ?" +
					" AND characters.code = ?" +
				" ORDER BY characters.name;"
			, [ codeRace, code ], (err: Error | null, data: iSQLRequestResult): void => {
				return err ? reject(err) : resolve(data);
			});

		}).then((characterData: iSQLRequestResult): Promise<iCharacter | null> => {

			return !characterData ? Promise.resolve(null) : Promise.resolve().then((): Promise<iCharacter | null> => {

				interface iSQLActionRequestResult {
					"code": string;
					"name": string;
					"file": string;
					"type_code": string;
					"type_name": string;
				}

				return new Promise((resolve: (data: iSQLActionRequestResult[]) => void, reject: (err: Error) => void): void => {

					this._db.all(
						" SELECT " +
							" actions.code, actions.name, actions.file," +
							" actions_types.code AS type_code, actions_types.name AS type_name" +
						" FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type" +
						" WHERE actions.k_character = ?" +
							(notWorded ? "" : " AND \"\" != actions.name") +
						";"
					, [ characterData.id ], (err: Error | null, data: iSQLActionRequestResult[]): void => {
						return err ? reject(err) : resolve(data);
					});

				}).then((data: iSQLActionRequestResult[]): Promise<iCharacter | null> => {

					return new Promise((resolve: (data: iCharacter) => void): void => {

						process.nextTick((): void => {

							const result: iCharacter = {
								"code": characterData.code,
								"name": characterData.name,
								"actions": []
							};

								data.forEach((action: iSQLActionRequestResult): void => {

									result.actions.push({
										"code": action.code,
										"name": action.name,
										"file": action.file,
										"type": {
											"code": action.type_code,
											"name": action.type_name
										}
									});

								});

							resolve(result);

						});

					});

				});

			});

		});

	}

}
