// deps

    // externals
    import React from "react";
    import { Image, CheckBoxPrettierLabel } from "react-bootstrap-fontawesome";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

    interface iStates {
        "notWordedSounds": boolean;
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
            "notWordedSounds": false
        };

    }

    // events

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

    public render (): React.JSX.Element {

        return <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">

            <div className="container-fluid">

                <span className="navbar-brand">

                    <Image src="/public/pictures/warcraft3.png" width={ 30 } height={ 30 } className="d-inline-block align-top" alt="Warcraft 3">
                        http://wolfangraul.deviantart.com/art/Warcraft-III-Reign-of-Chaos-Game-Icon-269282297
                    </Image>

                </span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarScroll">

                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">

                        <li className="nav-item">
                            <span className="nav-link disabled" aria-disabled="true">v--APP_VERSION--</span>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/api/descriptor">API documentation</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="--GITHUB_URL--">github</a>
                        </li>

                    </ul>

                    <form className="form-inline d-flex">

                        <CheckBoxPrettierLabel label={ "Intégrer les sons non traduits ('not worded')" }
                            margin-bottom={ 0 }
                            checked={ this.state.notWordedSounds } onToogle={ this._handleToogleNotWordedSounds.bind(this) }
                        />

                    </form>

                </div>

            </div>

        </nav>;

    }

}
