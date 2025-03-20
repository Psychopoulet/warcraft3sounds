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
	})

	// app

	app.get("/public/bundle.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "bundle.js"));
	}).get("/public/bundle.js.map", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "bundle.js.map"));
	});

	// libs

	app.get("/public/jquery.min.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "jquery-3.2.1.min.js"));
	}).get("/public/popper.min.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "popper-1.11.0.min.js"));
	}).get("/public/bootstrap.min.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "bootstrap-4.0.0-beta.min.js"));
	}).get("/public/angular.min.js", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "angular-1.6.5.min.js"));
	})

	// pictures

	.get("/public/pictures/warcraft3.png", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "pictures", "warcraft3.png"));
	}).get("/public/pictures/warcraft3TFT.png", (req: Request, res: Response): void  => {
		return res.sendFile(join(__dirname, "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
	});

}
