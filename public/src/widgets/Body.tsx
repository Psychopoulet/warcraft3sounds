"use strict";

// deps

    // externals
    
    import * as React from "react";

    import { Alert } from "react-bootstrap-fontawesome";

    // internals
    import Race from "./Race";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals
    import type { iRace } from "./Race";

// Props && States

    interface iStates {
        "notWordedSounds": boolean;
        "racesLoading": boolean;
        "races": iRace[];
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
            "racesLoading": true,
            "races": []
        };

    }

    public componentDidMount (): void {

    }

    public componentWillUnmount (): void {

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

    // render
    
    private _renderContent (): React.JSX.Element {

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

                { this.state.races.map((race: iRace): React.JSX.Element => {
                    return <Race race={ race } />;
                }) }

            </div>;

        }

    }

    public render (): React.JSX.Element {

        return <div className="container-fluid">

            <audio id="audio">
                <source src="#" type="audio" />
                Your browser does not support the audio element.
            </audio>

            { this._renderContent() }

        </div>;

    }

};
