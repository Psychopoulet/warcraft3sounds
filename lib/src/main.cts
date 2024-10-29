// deps

	// natives
	import { join } from "node:path";
	import { createServer as createSecureServer } from "node:https";
	import { createServer as createServer } from "node:http";

	// externals
	import ConfManager from "node-confmanager";
	import SimpleSSL from "simplessl";

	// locals

    import errorCodes from "./returncodes";

	import generateServer from "./server/generateServer";
	import webRoutes from "./server/webRoutes";
	import soundsRoutes from "./server/soundsRoutes";
	import apiRoutes from "./api/apiRoutes";

// types & interfaces

	// natives
	import type { Server as SecureServer } from "node:https";
	import type { Server } from "node:http";

	// externals
	import type { Express, Request, Response, NextFunction } from "express";

// consts

	const CONF: ConfManager = new ConfManager("test");

// module

	// generate conf
	Promise.resolve().then((): Promise<void> => {

		CONF.skeleton("port", "integer").document("port", "Port used by the server");
		CONF.skeleton("ssl", "boolean").document("ssl", "Is SSL activated ?");

		return CONF.load().then((): void => {

			CONF.set("port", CONF.has("port") ? CONF.get("port") : 3000);
			CONF.set("ssl", CONF.has("ssl") ? CONF.get("ssl") : false);

		});

	}).then((): Express => {

		return generateServer();

	// generate routes

	}).then((APP: Express): Promise<Express> => {

		webRoutes(APP);
		soundsRoutes(APP);

		return apiRoutes(APP).then((): Express => {
			return APP;
		});

	// generate web server

	}).then((APP: Express): Promise<SecureServer | Server> => {

		// catch error
		APP.use((err: Error, req: Request, res: Response, next: NextFunction): void => {

			console.log(err);

			if (res.headersSent) {
				return next(err);
			}
			else {
				res.status(errorCodes.INTERNAL).send("An internal error occured");
			}

		});

		// generate server

		if (CONF.get("ssl")) {

			const ssl: SimpleSSL = new SimpleSSL();

			return ssl.createCertificate(
				join(__dirname, "server.key"),
				join(__dirname, "server.csr"),
				join(__dirname, "server.crt"),
				"medium"
			).then((keys): SecureServer => {

				return createSecureServer({
					"key": keys.privateKey,
					"cert": keys.certificate
				}, APP);

			});

		}
		else {

			return Promise.resolve(createServer(APP));

		}

	// run server
	}).then((server: SecureServer | Server): void => {

		server.listen(CONF.get("port"), (): void => {
			console.info("started" + (CONF.get("ssl") ? " with SSL" : "") + " on port " + CONF.get("port"));
		});

	}).catch((err: Error): void => {

		console.error("");
		console.error("Impossible to initiate the application");
		console.error(err);
		console.error("");

		process.exitCode = 1;
		process.exit(1);

	});
