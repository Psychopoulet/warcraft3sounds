// deps

	// natives
	import { createServer as createSecureServer } from "node:https";
	import { createServer as createServer } from "node:http";

	// externals
	import ConfManager from "node-confmanager";
    import { pki } from "node-forge";

	// locals

    import logRequest from "./tools/logRequest";
    import getRequestPath from "./tools/getRequestPath";
    import errorCodes from "./returncodes";

	import generateServer from "./server/generateServer";
	import webRoutes from "./server/webRoutes";
	import apiRoutes from "./api/apiRoutes";
	import soundsRoutes from "./api/soundsRoutes";

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

	}).then((APP: Express): SecureServer | Server => {

		// catch "not found" request
		APP.use((req: Request, res: Response, next: NextFunction): void => {

			logRequest(req);
			console.error("Not found");

			if (res.headersSent) {
				return next("Not found");
			}
			else {

				res.status(errorCodes.NOTFOUND).json({
					"code": "NOT_FOUND",
					"message": getRequestPath(req) + " not found"
				});

			}

		});

		// catch error
		APP.use((err: Error, req: Request, res: Response, next: NextFunction): void => {

			logRequest(req);

			console.error(err);

			if (res.headersSent) {
				return next(err);
			}
			else {

				res.status(errorCodes.INTERNAL).json({
					"code": "INTERNAL_ERROR",
					"message": err.message
				});

			}

		});

		// generate server

		if (CONF.get("ssl")) {

			const keys: {
				"publicKey": pki.PublicKey;
				"privateKey": pki.PrivateKey;
			} = pki.rsa.generateKeyPair(4096);

			const cert: pki.Certificate = pki.createCertificate();

			cert.publicKey = keys.publicKey;
			cert.serialNumber = "01";
			cert.validity.notBefore = new Date();
			cert.validity.notAfter = new Date();
			cert.validity.notAfter.setFullYear(new Date().getFullYear() + 1); // one year validity

			const SSL_OPTIONS: Array<{
				"name": string;
				"value": string;
			}> = [
				{
					"name": "commonName",
					"value": "localhost"
				}, {
					"name": "organizationName",
					"value": "warcraft3sounds"
				}, {
					"name": "countryName",
					"value": "FR"
				}, {
					"name": "stateOrProvinceName",
					"value": "France"
				}, {
					"name": "localityName",
					"value": "Paris"
				}, {
					"name": "emailAddress",
					"value": "svida1@free.fr"
				}
			];

			console.info("certificate options :", JSON.stringify(SSL_OPTIONS));

			const SSL_EXTENSIONS: Array<Record<string, any>> = [
				{
					"name": "subjectAltName",
					"altNames": [ // types : 2 = dns name, 6 = URI, 7 = IP
						{
							"type": 2,
							"value": "warcraft3sounds"
						}, {
							"type": 2,
							"value": "localhost"
						}, {
							"type": 7,
							"value": "127.0.0.1"
						}
					]
				}
			];

			cert.setSubject(SSL_OPTIONS);
			cert.setIssuer(SSL_OPTIONS);
			cert.setExtensions(SSL_EXTENSIONS);

			cert.sign(keys.privateKey);

			const pemPrivateKey: string = pki.privateKeyToPem(keys.privateKey);
			const pemCertificate: string = pki.certificateToPem(cert);

			return createSecureServer({
				"key": pemPrivateKey,
				"cert": pemCertificate
			}, APP);

		}
		else {

			return createServer(APP);

		}

	// run server
	}).then((server: SecureServer | Server): void => {

		server.listen(CONF.get("port"), (): void => {
			console.info("started" + (CONF.get("ssl") ? " with SSL" : ""), "on port " + CONF.get("port"));
		});

	}).catch((err: Error): void => {

		console.error("");
		console.error("Impossible to initiate the application");
		console.error(err);
		console.error("");

		process.exitCode = 1;
		process.exit(1);

	});
