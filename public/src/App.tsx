// deps

    // externals

    import React from "react";

    // internals
    import { NotWordedSoundsProvider } from "./NotWordedSounds";
    import WarningLicence from "./widgets/WarningLicence";
    import Menu from "./widgets/Menu";
    import Body from "./widgets/Body";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

    interface iStates {
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
            "licenceWarningOpened": true
        };

    }

    // events

    private _handleCloseLicenceWarning (): void {

        this.setState({
            "licenceWarningOpened": false
        });

    }

    // render

    public render (): React.JSX.Element {

        return <>

            { this.state.licenceWarningOpened && <WarningLicence onClose={ this._handleCloseLicenceWarning.bind(this) } /> }

            <NotWordedSoundsProvider>

                <Menu />
                <Body />

            </NotWordedSoundsProvider>

        </>;

    }

}
