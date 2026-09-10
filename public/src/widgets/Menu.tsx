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

                <button type="button" className="navbar-toggler navbar-toggler-right" data-bs-toggle="collapse" data-bs-target="#IPS">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="IPS" className="collapse navbar-collapse">

                    <form className="form-inline">

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
