// deps

	// natives
	import { join, extname } from "node:path";
	import { stat, createReadStream } from "node:fs";

    // locals
    import errorCodes from "../returncodes";

// types & interfaces

	// natives
	import type { Stats } from "node:fs";

	// externals
	import type { Express, Request, Response } from "express";

// module

export default function soundsRoutes (app: Express): void {

	app.get("/public/sounds/:sound", (req: Request, res: Response): void  => {

		const file: string = join(__dirname, "..", "..", "..", "public", "sounds", req.params.sound);

		new Promise((resolve: (exists: boolean) => void): void => {

			stat(file, (err: NodeJS.ErrnoException | null, stats: Stats): void => {
				return resolve(!(err || !stats.isFile()));
			});

		}).then((exists: boolean): void => {

			if (exists) {

				res.status(errorCodes.OK).set({
					"Content-Type": ".wav" === extname(file) ? "audio/wav" : "audio/mpeg"
				});

				createReadStream(file).pipe(res);

			}
			else {

                console.warn("Cannot find", file);

				res.status(errorCodes.NOTFOUND).send("Impossible to find \"" + req.params.sound + "\"");

			}

		}).catch((err: Error): void => {

			console.error(err);

			res.status(errorCodes.INTERNAL).send("An internal error occured");

		});

	});

}
