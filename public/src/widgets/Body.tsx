"use strict";

// deps

    // externals

    import * as React from "react";

    import { Alert } from "react-bootstrap-fontawesome";

    // internals
    import Race from "./Race";

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
            "races": []
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

    public static getDerivedStateFromProps (props: iProps, state: iStates): iStates {

        if (props.notWordedSounds !== state.notWordedSounds) {

            return {
                ...state,
                "notWordedSounds": props.notWordedSounds
            };

        }

        return state;

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

        const audioSource: HTMLAudioElement = document.getElementById("audioSource") as HTMLAudioElement;

        if (audioSource) {

            if (audioSource.played) {
                audioSource.pause();
            }

            audioSource.currentTime = 0;
            audioSource.src = url;

            // sound.type = "audio/" + (-1 < url.indexOf(".mp3") ? "mp3" : "wav");

            if ("" !== url.trim()) {
                audioSource.play();
            }

        }

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

                </div>

                <audio id="audioSource">

                    <source src="#" type="audio" />

                    Your browser does not support the audio element.

                </audio>

            </>;

        }

    }

    public render (): React.JSX.Element {

        return <div className="container-fluid">

            { this._renderContent() }

        </div>;

    }

};
