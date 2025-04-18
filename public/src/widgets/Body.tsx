"use strict";

// deps

    // externals

    import React from "react";

    import { Alert } from "react-bootstrap-fontawesome";

    // internals
    import Race from "./Race";
    import SoundReader from "./SoundReader";

    // locals
    import getSDK from "../sdk";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals
    import type { iBasicDataWithUrl } from "../sdk";

// Props && States

    interface iStates {
        "notWordedSounds": boolean;
        "loading": boolean;
        "races": iBasicDataWithUrl[];
        "readedSoundUrl": string;
    };

    interface iProps extends iPropsNode {
        "notWordedSounds": boolean;
    }

// component

export default class Body extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "Body";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "notWordedSounds": props.notWordedSounds,
            "loading": true,
            "races": [],
            "readedSoundUrl": ""
        };

    }

    public componentDidMount (): void {

        this._handleRefresh();

    }

    public componentWillUnmount (): void {

        this.setState({
            "races": []
        });

    }

    public static getDerivedStateFromProps (props: iProps, state: iStates): iStates | null {

        if (props.notWordedSounds !== state.notWordedSounds) {

            return {
                ...state,
                "notWordedSounds": props.notWordedSounds
            };

        }

        return null;

    }

    // events

    private _handleRefresh (): void {

        this.setState({
            "loading": true,
            "races": []
        });

        getSDK().getRaces().then((races: iBasicDataWithUrl[]): void => {

            this.setState({
                "loading": false,
                "races": races
            });

        }).catch((err: Error): void => {

            console.error(err);
            alert(err.message);

            this.setState({
                "loading": false,
                "races": []
            });

        });

    }

    private _handleChangeSound (url: string): void {

        this.setState({
            "readedSoundUrl": url
        });

    }

    // render

    private _renderContent (): React.JSX.Element {

        if (this.state.loading) {

            return <div className="row justify-content-center">

                <div className="col-md-6">

                    <Alert variant="info">
                        Loading races...
                    </Alert>

                </div>

            </div>;

        }
        else if (0 >= this.state.races.length) {

            return <div className="row justify-content-center">

                <div className="col-md-6">

                    <Alert variant="warning">
                        There is no race detected
                    </Alert>

                </div>

            </div>;

        }
        else {

            return <>

                <div className="row">

                    { this.state.races.map((race: iBasicDataWithUrl): React.JSX.Element => {

                        return <div key={ race.code } className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                            <Race race={ race } onChangeSound={ this._handleChangeSound.bind(this) } />
                        </div>;

                    }) }

                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <SoundReader src={ this.state.readedSoundUrl } />
                    </div>

                </div>

            </>;

        }

    }

    public render (): React.JSX.Element {

        return <div className="container-fluid">

            { this._renderContent() }

        </div>;

    }

};
