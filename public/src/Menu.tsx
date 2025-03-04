"use strict";

// deps

    // externals
    import * as React from "react";
    import { Image } from "react-bootstrap-fontawesome";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals
	interface iAddress {
		"address": string;
		"name": string;
	}

// Props && States

    interface iStates {
        "loading": boolean;
        "ips": iAddress[];
    }

    interface iProps extends iPropsNode {
        "notWordedSounds": boolean;
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
            "loading": true,
            "ips": []
        };

    }

    public componentDidMount (): void {

    }

    public componentWillUnmount (): void {

    }

    // render

    private _renderIps (): JSX.Element {

        if (this.state.loading) {
            return <span className="nav-item nav-link">Loading IPs...</span>;
        }
        else if (0 >= this.state.ips.length) {
            return <span className="nav-item nav-link">There is no IP detected</span>
        }
        else {

            return this.state.ips.map((ip: iAddress): JSX.Element => {

                return <span className="nav-item nav-link">
                    { ip.name } : { ip.address }
                </span>;

            });

        }

    }

    public render (): JSX.Element {

        return <nav className="navbar navbar-expand-md navbar-dark bg-dark">

            <span className="navbar-brand">
                <Image src="/public/pictures/warcraft3.png" width={ 30 } height={ 30 } className="d-inline-block align-top" alt="Warcraft 3" />
                <!-- http://wolfangraul.deviantart.com/art/Warcraft-III-Reign-of-Chaos-Game-Icon-269282297 -->
            </span>

            <button type="button" className="navbar-toggler navbar-toggler-right" data-toggle="collapse" data-target="#IPS">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div id="IPS" className="collapse navbar-collapse">

                <div className="navbar-nav mr-auto">
                    { this._renderIps() }
                </div>

                <form className="form-inline">

                    <div className="input-group border-light">

                        <span className="input-group-addon">
                            <input id="notworded" type="checkbox" data-ng-model="notWorded" />
                        </span>

                        <label htmlFor="notworded" className="input-group-addon text-light bg-dark border-light">Include "not worded" sounds</label>

                    </div>

                </form>

            </div>

        </nav>;

    }

};
