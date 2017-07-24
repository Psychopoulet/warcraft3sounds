
"use strict";

// deps
	
	const path = require("path");
	const fs = require("fs");

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");

	const conf = require("node-confmanager");

	const APIV1Routes = require(path.join(__dirname, "api", "v1", "routes.js"));

// consts

	const CURRENT_API = 1;

// private

	// attributes

		var _app = express();
		var _conf = new conf(path.join(__dirname, "conf.json"));

	// methods

		function _getIp(req) {
			let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			return ("::1" === ip) ? "127.0.0.1" : ip;
		}

		function _getFileContent(path) {

			return new Promise((resolve, reject) => {

				fs.readFile(path, "utf8", (err, content) => {

					if (err) {
						reject(err);
					}
					else {
						resolve(content);
					}

				});

			});
			
		}

// module

	_conf.load().then(() => {

		_app
			.use(cors())
			.use(helmet())
			.use(compression())
			.use((err, req, res, next) => {
				res.status(500).send("Ouups ! Something broke ! <br />" + ((err.message) ? err.message : err));
			});

		// main page

		_app.get("/", (req, res) => {

			_getFileContent(path.join(__dirname, "web", "index.html")).then((content) => {

				res.writeHead(200, { "Content-Type": "text/html" + ";" + " charset=utf-8" });

				res.end(
					content.replace("{{clientip}}", _getIp(req)).replace("{{apiversion}}", CURRENT_API),
					"utf-8"
				);

			}).catch((err) => {
				_send(500, "text/html", "Ouups ! Something broke ! <br />" + ((err.message) ? err.message : err), req, res);
			});
			
		}).get("/public/app.js", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "app.js"));
		})

		// pictures

		.get("/public/pictures/warcraft3.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3.png"));
		}).get("/public/pictures/warcraft3TFT.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3TFT.png"));
		});

		// add API V1 routes

		APIV1Routes(_app).catch((err) => {
			console.log("Impossible to initiate the API (V1)");
			console.log(err);
		});

		_app.listen(_conf.get("port"));

	}).catch((err) => {
		console.log("Impossible to initiate the configuration");
		console.log(err);
	});
