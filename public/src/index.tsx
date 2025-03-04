"use strict";

// deps

	// externals
	import * as React from "react";
	import { createRoot } from "react-dom/client";

	// locals
	import App from "./App";
	import Menu from "./Menu";

// private

	let _notWordedSounds: boolean = false;

	function _handleToogleNotWordedSounds (newVal: boolean): void {
		_notWordedSounds = newVal;
	}

// render

createRoot(document.getElementById("Warcraft3SoundsApp") as HTMLElement).render(<>
	<Menu notWordedSounds={ _notWordedSounds } onToogleNotWordedSounds={ _handleToogleNotWordedSounds } />
	<App notWordedSounds={ _notWordedSounds } />
</>);
