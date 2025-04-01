// deps

	// natives
	import { join } from "node:path";

// types & interfaces

	// externals
	import type { Express, Request, Response } from "express";

// module

export default function webRoutes (app: Express): void {

	// main page

	app.get([ "/", "/public/index.html" ], (req: Request, res: Response): void => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "index.html"));
	}).get("/public/app.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "app.js"));
	});

	// app

	app.get("/public/bundle.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "bundle.js"));
	}).get("/public/bundle.js.map", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "bundle.js.map"));
	});

	// pictures

	app.get("/public/pictures/warcraft3.png", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "pictures", "warcraft3.png"));
	}).get("/public/pictures/warcraft3TFT.png", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
	});

}
