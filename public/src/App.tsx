"use strict";

// deps

	// externals
	import * as React from "react";

// types & interfaces

	// externals
	import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

	interface iStates {};

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

		this.state = {};

	}

	public componentDidMount (): void {

	}

	public componentWillUnmount (): void {

	}

	// render

	public render (): JSX.Element {

		return <div className="container-fluid" data-ng-controller="MainController">

			<audio id="audio">
				<source src="#" type="audio" />
				Your browser does not support the audio element.
			</audio>

			<div class="row justify-content-center" data-ng-show="racesLoading">

				<div class="col-md-6" data-ng-show="racesLoading">

					<div class="alert alert-info">
						Loading races...
					</div>

				</div>

			</div>

			<div class="row" data-ng-hide="racesLoading">

				<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" data-ng-repeat="race in races" data-ng-controller="RaceController">

					<div class="card" data-ng-class="{ 'border-warning': raceLoading }">

						<div class="card-header" data-ng-class="{ 'bg-warning': raceLoading }">
							<h5 class="float-left">{{race.name}}</h5>
						</div>

						<div class="card-body" data-ng-show="raceLoading">
							loading
						</div>

						<div class="card-body" data-ng-hide="raceLoading">

							<div class="form-group" data-ng-show="race.musics.length">

								<label for="{{race.code}}Musics">Musics</label>

								<div class="input-group">

									<select
										id="{{race.code}}Musics" class="form-control"
										data-ng-options="music as music.name for music in race.musics track by music.code" data-ng-model="music"
									>
										<option value="">--</option>
									</select>

									<span class="input-group-btn">

										<button class="btn btn-secondary" type="button" data-ng-class="{ 'disabled' : !music || !music.url }" data-ng-disabled="!music || !music.url" data-ng-click="play(music.url);">
											<span class="fa fa-play-circle"></span>
										</button>

									</span>

								</div>

							</div>

							<div class="form-group" data-ng-show="race.warnings.length">

								<label for="{{race.code}}Warnings">Warnings</label>

								<div class="input-group">

									<select
										id="{{race.code}}Warnings" class="form-control"
										data-ng-options="warning as warning.name for warning in race.warnings track by warning.code" data-ng-model="warning"
									>
										<option value="">--</option>
									</select>

									<span class="input-group-btn">

										<button class="btn btn-secondary" type="button" data-ng-class="{ 'disabled' : !warning || !warning.url }" data-ng-disabled="!warning || !warning.url" data-ng-click="play(warning.url);">
											<span class="fa fa-play-circle"></span>
										</button>

									</span>

								</div>

							</div>

							<div class="form-group" data-ng-show="race.characters.length">

								<label for="{{race.code}}Characters">Characters</label>

								<select
									id="{{race.code}}Characters" class="form-control"
									data-ng-options="character as character.name for character in race.characters track by character.code" data-ng-model="character"
									data-ng-change="loadActions();"
									data-ng-show="race.characters.length"
								>
									<option value="">--</option>
								</select>

							</div>

							<div class="form-group" data-ng-show="character && !actionsLoading">

								<label for="{{race.code}}{{character.code}}Action">Actions</label>

								<div class="form-control-static" data-ng-hide="actions.length">There is no action</div>

								<div class="input-group" data-ng-show="actions.length">

									<select
										id="{{race.code}}{{character.code}}Action" class="form-control"
										data-ng-options="action as action.name group by action.type.name for action in actions track by action.code" data-ng-model="action"
									>
										<option value="">--</option>
									</select>

									<span class="input-group-btn">

										<button class="btn btn-secondary" type="button" data-ng-class="{ 'disabled' : !action || !action.url }" data-ng-disabled="!action || !action.url" data-ng-click="play(action.url);">
											<span class="fa fa-play-circle"></span>
										</button>

									</span>

								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>;

	}

};
