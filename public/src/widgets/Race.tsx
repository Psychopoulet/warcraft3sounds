"use strict";

// deps

    // externals

    import React from "react";

	import {
        Card, CardHeader, CardBody,
        SelectLabel, Select, InputReadOnlyLabel
    } from "react-bootstrap-fontawesome";

    // locals
    import getSDK from "../sdk";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

	// locals
    import type { descriptorTypes } from "../sdk";

// Props && States

    interface iStates {
        "loading": boolean;
        "race": descriptorTypes["Race"] | null;
        "selectedSound": string;
        "selectedCharacter": string;
        "loadingCharacter": boolean;
        "character": descriptorTypes["Character"] | null;
    }

    interface iProps extends iPropsNode {
        "race": descriptorTypes["BasicDataWithUrl"];
        "notWordedSounds": boolean;
        "onChangeSound": (url: string) => void;
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
            "race": null,
            "selectedSound": "",
            "selectedCharacter": "",
            "loadingCharacter": false,
            "character": null
        };

    }

    public componentDidMount (): void {

        this._handleRefresh();

    }

    public componentWillUnmount (): void {

        this.setState({
            "race": null,
            "character": null
        });

    }

    // events

    private _handleRefresh (): void {

        this.setState({
            "loading": true,
            "race": null
        });

        getSDK().getRace(this.props.race.code).then((race: descriptorTypes["Race"]): void => {

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

    private _handleChangeSound (e: React.ChangeEvent<HTMLSelectElement>, value: string): void {

        e.stopPropagation();
        e.preventDefault();

        this.setState({
            "selectedSound": value
        });

        this.props.onChangeSound(value);

    }

    private _handleChangeCharacter (e: React.ChangeEvent<HTMLSelectElement>, value: string): void {

        e.stopPropagation();
        e.preventDefault();

        this.setState({
            "loadingCharacter": true,
            "selectedCharacter": value,
            "character": null
        });

        if ("" !== value) {

            getSDK().getCharacter(this.props.race.code, value, this.props.notWordedSounds).then((character: descriptorTypes["Character"]): void => {

                this.setState({
                    "loadingCharacter": false,
                    "character": character
                });

            }).catch((err: Error): void => {

                console.error(err);
                alert(err.message);

                this.setState({
                    "loadingCharacter": false,
                    "character": null
                });

            });

        }

    }

    // render

    private _renderMusics (): React.JSX.Element {

        if (!this.state.race || 0 >= this.state.race?.musics.length) {

            return <InputReadOnlyLabel label="Musics" value="No music found" />;

        }
        else {

            return <SelectLabel id={ this.state.race.code + "-musics" } label="Musics"
                value={ this.state.selectedSound } onChange={ this._handleChangeSound.bind(this) }
            >

                <option value="">--</option>

                { this.state.race?.musics.map((content: descriptorTypes["BasicDataWithUrl"]): React.JSX.Element => {
                    return <option key={ content.code } value={ content.url }>{ content.name }</option>;
                }) }

            </SelectLabel>;

        }

    }

    private _renderWarnings (): React.JSX.Element {

        if (!this.state.race || 0 >= this.state.race?.warnings.length) {

            return <InputReadOnlyLabel label="Warnings" value="No warning found" />;

        }
        else {

            return <SelectLabel id={ this.state.race.code + "-warnings" } label="Warnings"
                value={ this.state.selectedSound } onChange={ this._handleChangeSound.bind(this) }
            >

                <option value="">--</option>

                { this.state.race?.warnings.map((content: descriptorTypes["BasicDataWithUrl"]): React.JSX.Element => {
                    return <option key={ content.code } value={ content.url }>{ content.name }</option>;
                }) }

            </SelectLabel>;

        }

    }

    private _renderActions (): Array<React.JSX.Element> | null {

        if (!this.state.character?.actions || 0 >= this.state.character?.actions.length) {
            return null;
        }
        else {

            return this.state.character.actions.map((action: descriptorTypes["Action"]): string => {
                return action.type.code;
            }).filter((item: string, pos: number, a: Array<string>): boolean => {
                return a.indexOf(item) == pos;
            }).sort().map((actionName: string): React.JSX.Element => {

                return <optgroup label={ actionName }>

                    { this.state.character?.actions.filter((action: descriptorTypes["Action"]): boolean => {
                        return action.type.code === actionName;
                    }).map((content: descriptorTypes["Action"]): React.JSX.Element => {
                        return <option key={ content.code } value={ content.url }>{ content.name }</option>;
                    }) }

                </optgroup>;

            });

        }

    }

    private _renderCharacters (): React.JSX.Element {

        if (!this.state.race || 0 >= this.state.race?.characters.length) {

            return <InputReadOnlyLabel label="Characters" value="No character found" margin-bottom={ 0 } />;

        }
        else if (!this.state.character || 0 >= this.state.character?.actions.length) {

            return <SelectLabel id={ this.state.race.code + "-characters" } label="Characters"
                margin-bottom={ 0 }
                value={ this.state.selectedCharacter } onChange={ this._handleChangeCharacter.bind(this) }
            >

                <option value="">--</option>

                { this.state.race?.characters.map((content: descriptorTypes["BasicDataWithUrl"]): React.JSX.Element => {
                    return <option key={ content.code } value={ content.code }>{ content.name }</option>;
                }) }

            </SelectLabel>;

        }
        else {

            return <>

                <label htmlFor={ this.state.race.code + "-actions" } aria-label="Actions">Actions</label>

                <div className="input-group">

                    <Select id={ this.state.race.code + "-characters" }
                        value={ this.state.selectedCharacter } onChange={ this._handleChangeCharacter.bind(this) }
                    >

                        <option value="">--</option>

                        { this.state.race?.characters.map((content: descriptorTypes["BasicDataWithUrl"]): React.JSX.Element => {
                            return <option key={ content.code } value={ content.code }>{ content.name }</option>;
                        }) }

                    </Select>

                    <Select id={ this.state.race.code + "-actions" }
                        value={ this.state.selectedSound } onChange={ this._handleChangeSound.bind(this) }
                    >

                        <option value="">--</option>

                        { this._renderActions() }

                    </Select>

                </div>

            </>;

        }

    }

    private _renderBody (): React.JSX.Element {

        if (this.state.loading) {
            return <CardBody>Loading...</CardBody>;
        }
        else {

            return <CardBody>

                { this._renderMusics() }

                { this._renderWarnings() }

                { this._renderCharacters() }

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
