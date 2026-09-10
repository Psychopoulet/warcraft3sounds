// deps

    // externals

    import React from "react";

    // internals
    import WarningLicence from "./widgets/WarningLicence";
    import Menu from "./widgets/Menu";
    import Body from "./widgets/Body";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

    interface iStates {
        "notWordedSounds": boolean;
        "licenceWarningOpened": boolean;
    }

// component

export default class App extends React.Component<iPropsNode, iStates> {

    // name

        public static displayName: string = "App";

    // constructor

    public constructor (props: iPropsNode) {

        super(props);

        // states

        this.state = {
            "notWordedSounds": false,
            "licenceWarningOpened": true
        };

    }

    // events

    private _handleToogleNotWordedSounds (newValue: boolean): void {

        this.setState({
            "notWordedSounds": newValue
        });

    }

    private _handleCloseLicenceWarning (): void {

        this.setState({
            "licenceWarningOpened": false
        });

    }

    // render

    public render (): React.JSX.Element {

        return <>

            { this.state.licenceWarningOpened && <WarningLicence onClose={ this._handleCloseLicenceWarning.bind(this) } /> }

            <Menu onToogleNotWordedSounds={ this._handleToogleNotWordedSounds.bind(this) } />
            <Body notWordedSounds={ this.state.notWordedSounds } />

        </>;

    }

}
