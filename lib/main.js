
"use strict";

// deps

	const { join } = require("path");
	const { networkInterfaces } = require("os");

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");
	const fileupload = require("express-fileupload");

	const Conf = require("node-confmanager");

	const apiv1routes = require(join(__dirname, "api", "v1", "routes.js"));

// consts

	const APP = express();
	const CONF = new Conf(join(__dirname, "conf.json"));
	const CODE_ERRORS = require(join(__dirname, "returncodes.json"));

// module

	CONF.load().then(() => {

		APP
			.use(cors())
			.use(helmet())
			.use(compression())
			.use(fileupload())
			.use((err, req, res, next) => {

				if (res.headersSent) {
					next(err); return;
				}

				res.status(CODE_ERRORS.INTERNAL).send(
					"Ouups ! Something broke ! <br />" + (err.message ? err.message : err)
				);

			});

		// main page

		APP.get("/", (req, res) => {
			res.sendFile(join(__dirname, "public", "index.html"));
		})
		.get("/public/app.js", (req, res) => {
			res.sendFile(join(__dirname, "public", "app.js"));
		})

		// pictures

		.get("/public/pictures/warcraft3.png", (req, res) => {
			res.sendFile(join(__dirname, "public", "pictures", "warcraft3.png"));
		})
		.get("/public/pictures/warcraft3TFT.png", (req, res) => {
			res.sendFile(join(__dirname, "public", "pictures", "warcraft3TFT.png"));
		})

		// ips
		.get("/ips", (req, res) => {

			const result = [];

				const ifaces = networkInterfaces();

				Object.keys(ifaces).forEach((ifname) => {

					let alias = 0;

					ifaces[ifname].forEach((iface) => {

						if ("IPv4" !== iface.family || false !== iface.internal) {
							return;
						}
						else if (1 <= alias) {

							result.push({
								"address": iface.address,
								"name": ifname + "-" + alias
							});

						}
						else {

							result.push({
								"address": iface.address,
								"name": ifname
							});

						}

						++alias;

					});

				});

			res.status(CODE_ERRORS.OK).json(result);

		});

		// add API V1 routes

		return apiv1routes(APP).then(() => {

			APP.listen(CONF.get("port"), () => {
				console.info("started on port", CONF.get("port"));
			});

			return Promise.resolve();

		}).catch((err) => {
			console.warn("Impossible to initiate the API (V1)", err);
		});

	}).catch((err) => {
		console.error("Impossible to initiate the configuration", err);
	});
