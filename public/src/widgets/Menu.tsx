"use strict";

// deps

    // externals
    import React from "react";
    import { Image, CheckBoxPrettierLabel } from "react-bootstrap-fontawesome";

    // locals
    import getSDK from "../sdk";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals
    import type { descriptorTypes } from "../sdk";

// Props && States

    interface iStates {
        "notWordedSounds": boolean;
        "loading": boolean;
        "ips": Array<descriptorTypes["IP"]>;
    }

    interface iProps extends iPropsNode {
        "onToogleNotWordedSounds": (newVal: boolean) => void;
    }

// component

export default class Menu extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "Menu";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "notWordedSounds": false,
            "loading": true,
            "ips": []
        };

    }

    public componentDidMount (): void {

        this._handleRefresh();

    }

    public componentWillUnmount (): void {

        this.setState({
            "ips": []
        });

    }

    // events

    private _handleRefresh (): void {

        this.setState({
            "loading": true,
            "ips": []
        });

        getSDK().getIps().then((ips: Array<descriptorTypes["IP"]>): void => {

            this.setState({
                "loading": false,
                "ips": ips
            });

        }).catch((err: Error): void => {

            console.error(err);
            alert(err.message);

            this.setState({
                "loading": false,
                "ips": []
            });

        });

    }

    private _handleToogleNotWordedSounds (e: React.ChangeEvent<HTMLInputElement>): void {

        const value: boolean = e.target.checked;

        if (value === this.state.notWordedSounds) {
            return;
        }

        this.setState({
            "notWordedSounds": value
        });

        if ("function" === typeof this.props.onToogleNotWordedSounds) {
            this.props.onToogleNotWordedSounds(value);
        }

    }

    // render

    private _renderIps (): React.JSX.Element | React.JSX.Element[] {

        if (this.state.loading) {
            return <span className="nav-item nav-link">Loading IPs...</span>;
        }
        else if (0 >= this.state.ips.length) {
            return <span className="nav-item nav-link">There is no IP detected</span>;
        }
        else {

            return this.state.ips.map((ip: descriptorTypes["IP"], index: number): React.JSX.Element => {

                return <span key={ index } className="nav-item nav-link">
                    { ip.name } : { ip.address }
                </span>;

            });

        }

    }

    public render (): React.JSX.Element {

        return <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">

            <div className="container-fluid">

                <span className="navbar-brand">

                    <Image src="/public/pictures/warcraft3.png" width={ 30 } height={ 30 } className="d-inline-block align-top" alt="Warcraft 3">
                        http://wolfangraul.deviantart.com/art/Warcraft-III-Reign-of-Chaos-Game-Icon-269282297
                    </Image>

                </span>

                <button type="button" className="navbar-toggler navbar-toggler-right" data-bs-toggle="collapse" data-bs-target="#IPS">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="IPS" className="collapse navbar-collapse">

                    <div className="navbar-nav me-auto">
                        { this._renderIps() }
                    </div>

                    <form className="form-inline">

                        <CheckBoxPrettierLabel label={ "Include \"not worded\" sounds" }
                            margin-bottom={ 0 }
                            checked={ this.state.notWordedSounds } onToogle={ this._handleToogleNotWordedSounds.bind(this) }
                        />

                    </form>

                </div>

            </div>

        </nav>;

    }

}
