"use strict";

// deps

    // externals
    import * as React from "react";
    import {
        Modal, ModalBody, ModalFooter,
        InputIntegerLabel, SelectLabel,
        ButtonGroup, Button
    } from "react-bootstrap-fontawesome";

    // locals

        // wrapper
        import RFIDNedapWrapper from "../wrapper/RFIDNedapWrapper";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals
    import type {
        tCommandRunning,
        iLightSwitchOnRequestOrResult, iLightSwitchOffRequestOrResult
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
        "light": iLightSwitchOnRequestOrResult;
    };

// component

export default class Light extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "Light";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "commandRunning": this.props.commandRunning,
            "light": {
                "type": "internal",
                "red": 0,
                "green": 0,
                "blue": 0
            }
        };

    }

    static getDerivedStateFromProps(nextProps: iProps, prevState: iStates): iStates {

        return {
            ...prevState,
            "commandRunning": nextProps.commandRunning
        };

    }

    // events handlers

    private _handleChangeLightType (e: React.ChangeEvent<HTMLSelectElement>, newValue: string): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "light": {
                ...this.state.light,
                "type": newValue as iLightSwitchOffRequestOrResult["type"]
            }
        });

    }

    private _handleChangeLightRed (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "light": {
                ...this.state.light,
                "red": newValue
            }
        });

    }

    private _handleChangeLightGreen (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "light": {
                ...this.state.light,
                "green": newValue
            }
        });

    }

    private _handleChangeLightBlue (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "light": {
                ...this.state.light,
                "blue": newValue
            }
        });

    }

    private _handleLightOn (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.switchLightOnDevice(this.state.light).catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    private _handleLightOff (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.switchLightOffDevice(this.state.light).catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    // render

    public render (): JSX.Element {

        return <Modal appId="app" centered size="md"
            title="Light"
            onClose={ this.props.onClose }
        >

            <ModalBody className="pb-0">

                <div className="row">

                    <div className="col-12">

                        <SelectLabel label="Type"
                            required disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                            value={ this.state.light.type }
                            onChange={ this._handleChangeLightType.bind(this) }
                        >

                            <option value="external">external</option>
                            <option value="internal">internal</option>

                        </SelectLabel>

                    </div>

                    <div className="col-12 col-md-4">

                        <InputIntegerLabel label="Red"
                            required disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                            value={ this.state.light.red }
                            onChange={ this._handleChangeLightRed.bind(this) }
                        />

                    </div>

                    <div className="col-12 col-md-4">

                        <InputIntegerLabel label="Green"
                            required disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                            value={ this.state.light.green }
                            onChange={ this._handleChangeLightGreen.bind(this) }
                        />

                    </div>

                    <div className="col-12 col-md-4">

                        <InputIntegerLabel label="Blue"
                            required disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                            value={ this.state.light.blue }
                            onChange={ this._handleChangeLightBlue.bind(this) }
                        />

                    </div>

                </div>

            </ModalBody>

            <ModalFooter>

                <ButtonGroup block>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                        onClick={ this._handleLightOn.bind(this) }
                    >
                        On
                    </Button>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                        onClick={ this._handleLightOff.bind(this) }
                    >
                        Off
                    </Button>

                </ButtonGroup>

            </ModalFooter>

        </Modal>;

    }

};
