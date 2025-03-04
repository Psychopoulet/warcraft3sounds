"use strict";

// deps

    // externals
    import * as React from "react";
    import {
        Modal, ModalBody, ModalFooter,
        InputIntegerLabel,
        Button
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
        iBuzzerRequestOrResult
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
		"buzzer": iBuzzerRequestOrResult;
    };

// component

export default class Buzzer extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "Buzzer";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "commandRunning": this.props.commandRunning,
			"buzzer": {
				"duration": 75,
				"repeat": 0
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

    private _handleChangeBuzzerDuration (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "buzzer": {
                ...this.state.buzzer,
                "duration": newValue
            }
        });

    }

    private _handleChangeBuzzerRepeat (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "buzzer": {
                ...this.state.buzzer,
                "repeat": newValue
            }
        });

    }

    private _handleBuzzer (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.buzzerDevice(this.state.buzzer).catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    // render

    public render (): JSX.Element {

        return <Modal appId="app" centered size="md"
            title="Buzzer"
            onClose={ this.props.onClose }
        >

            <ModalBody className="pb-0">

                <div className="row">

                    <div className="col-12 col-md-6">

                        <InputIntegerLabel label="Duration"
                            required disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                            value={ this.state.buzzer.duration }
                            onChange={ this._handleChangeBuzzerDuration.bind(this) }
                        />

                    </div>

                    <div className="col-12 col-md-6">

                        <InputIntegerLabel label="Repeat"
                            required disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                            value={ this.state.buzzer.repeat }
                            onChange={ this._handleChangeBuzzerRepeat.bind(this) }
                        />

                    </div>

                </div>

            </ModalBody>

            <ModalFooter>

                <Button variant="info" block
                    disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                    onClick={ this._handleBuzzer.bind(this) }
                >
                    Execute
                </Button>

            </ModalFooter>

        </Modal>;

    }

};
