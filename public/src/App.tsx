"use strict";

// deps

	// externals
	import * as React from "react";
	import { JSX } from "react";

	// externals
	import { Alert } from "react-bootstrap-fontawesome";

	// internals
	import Race from "./widgets/Race";

// types & interfaces

	// externals
	import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

	interface iStates {
		"racesLoading": boolean;
		"races": string[];
	};

	interface iProps extends iPropsNode {
		"notWordedSounds": boolean;
	}

// component

export default class App extends React.Component<iProps, iStates> {

	// name

		public static displayName: string = "App";

	// constructor

	public constructor (props: iProps) {

		super(props);

		// states

		this.state = {
			"racesLoading": true,
			"races": []
		};

	}

	public componentDidMount (): void {

	}

	public componentWillUnmount (): void {

	}

	// render
	
	private _renderContent (): JSX.Element {

		if (!this.state.racesLoading) {
			
			return <div className="row justify-content-center">

				<div className="col-md-6">

					<Alert variant="info">
						Loading races...
					</Alert>

				</div>

			</div>;

		}
		else {

			return <div className="row">

				{ this.state.races.map((race: string): JSX.Element => {
					return <Race race={ race } />;
				}) }

			</div>;

		}

	}

	public render (): JSX.Element {

		return <div className="container-fluid">

			<audio id="audio">
				<source src="#" type="audio" />
				Your browser does not support the audio element.
			</audio>

			{ this._renderContent() }

		</div>;

	}

};
