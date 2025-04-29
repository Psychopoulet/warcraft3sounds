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
	import type { Express, Request, Response, NextFunction } from "express";

    // locals
	import type { paths } from "../descriptor";

// module

export default function soundsRoutes (app: Express): void {

	app.get("/public/sounds/:sound", (req: Request, res: Response, next: NextFunction): void  => {

		const sound: paths["/public/sounds/{sound}"]["get"]["parameters"]["path"]["sound"] = req.params.sound;
		const file: string = join(__dirname, "..", "..", "..", "public", "sounds", sound);

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

				res.status(errorCodes.NOTFOUND).json({
					"code": String(errorCodes.NOTFOUND),
					"message": "Impossible to find the \"" + sound + "\" sound"
				} as paths["/public/sounds/{sound}"]["get"]["responses"]["default"]["content"]["application/json"]);

			}

		}).catch(next);

	});

}
