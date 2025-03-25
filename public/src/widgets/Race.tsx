"use strict";

// deps

    // externals

    import * as React from "react";

	import {
        Card, CardHeader, CardBody
    } from "react-bootstrap-fontawesome";

    // locals
    import getSDK from "../sdk";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

	// locals
	import type { iBasicDataWithUrl, iRace } from "../../../lib/src/api/model";
	export type { iRace };

// Props && States

    interface iStates {
        "loading": boolean;
        "race": iRace | null;
    };

    interface iProps extends iPropsNode {
        "race": iBasicDataWithUrl;
    }

// component

export default class Race extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "Race";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "loading": true,
            "race": null
        };

    }

    public componentDidMount (): void {

        this._handleRefresh();

    }

    public componentWillUnmount (): void {

        this.setState({
            "race": null
        });

    }

    // events

    private _handleRefresh (): void {

        this.setState({
            "loading": true,
            "race": null
        });

        getSDK().getRace(this.props.race.code).then((race: iRace): void => {

            this.setState({
                "loading": false,
                "race": race
            });

        }).catch((err: Error): void => {

            console.error(err);
            alert(err.message);

            this.setState({
                "loading": false,
                "race": null
            });

        });

    }

    // render

    private _renderBody (): React.JSX.Element {

        if (this.state.loading) {
            return <CardBody>Loading...</CardBody>;
        }
        else {

            return <CardBody>

                <div className="form-group" data-ng-show="race.musics.length">

                    <label htmlFor="{{race.code}}Musics">Musics</label>

                    <div className="input-group">

                        <select
                            id="{{race.code}}Musics" className="form-control"
                            data-ng-options="music as music.name for music in race.musics track by music.code" data-ng-model="music"
                        >
                            <option value="">--</option>
                        </select>

                        <span className="input-group-btn">

                            <button className="btn btn-secondary" type="button" data-ng-className="{ 'disabled' : !music || !music.url }" data-ng-disabled="!music || !music.url" data-ng-click="play(music.url);">
                                <span className="fa fa-play-circle"></span>
                            </button>

                        </span>

                    </div>

                </div>

                <div className="form-group" data-ng-show="race.warnings.length">

                    <label htmlFor="{{race.code}}Warnings">Warnings</label>

                    <div className="input-group">

                        <select
                            id="{{race.code}}Warnings" className="form-control"
                            data-ng-options="warning as warning.name for warning in race.warnings track by warning.code" data-ng-model="warning"
                        >
                            <option value="">--</option>
                        </select>

                        <span className="input-group-btn">

                            <button className="btn btn-secondary" type="button" data-ng-className="{ 'disabled' : !warning || !warning.url }" data-ng-disabled="!warning || !warning.url" data-ng-click="play(warning.url);">
                                <span className="fa fa-play-circle"></span>
                            </button>

                        </span>

                    </div>

                </div>

                <div className="form-group" data-ng-show="race.characters.length">

                    <label htmlFor="{{race.code}}Characters">Characters</label>

                    <select
                        id="{{race.code}}Characters" className="form-control"
                        data-ng-options="character as character.name for character in race.characters track by character.code" data-ng-model="character"
                        data-ng-change="loadActions();"
                        data-ng-show="race.characters.length"
                    >
                        <option value="">--</option>
                    </select>

                </div>

                <div className="form-group" data-ng-show="character && !actionsLoading">

                    <label htmlFor="{{race.code}}{{character.code}}Action">Actions</label>

                    <div className="form-control-static" data-ng-hide="actions.length">There is no action</div>

                    <div className="input-group" data-ng-show="actions.length">

                        <select
                            id="{{race.code}}{{character.code}}Action" className="form-control"
                            data-ng-options="action as action.name group by action.type.name for action in actions track by action.code" data-ng-model="action"
                        >
                            <option value="">--</option>
                        </select>

                        <span className="input-group-btn">

                            <button className="btn btn-secondary" type="button" data-ng-className="{ 'disabled' : !action || !action.url }" data-ng-disabled="!action || !action.url" data-ng-click="play(action.url);">
                                <span className="fa fa-play-circle"></span>
                            </button>

                        </span>

                    </div>

                </div>

            </CardBody>;

        }

    }

    public render (): React.JSX.Element {

        return <Card variant={ this.state.loading ? "warning" : undefined }>

            <CardHeader>
                <h5 className="float-left">{ this.props.race.name }</h5>
            </CardHeader>

            { this._renderBody() }

        </Card>;

    }

};
