// deps

	// externals
	import express from "express";
	import cors from "cors";
	import helmet from "helmet";
	import compression from "compression";

// module

export default function generateServer () {

	return Promise.resolve(express()
		.use(cors())
		.use(helmet())
		.use(compression())
	);

}
