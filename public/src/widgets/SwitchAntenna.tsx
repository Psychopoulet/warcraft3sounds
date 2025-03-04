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
        iSwitchAntennaRequestOrResult
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
		"switchAntenna": iSwitchAntennaRequestOrResult;
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
			"switchAntenna": {
				"count": 0
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

    private _handleChangeSwitchAntennaCount (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "switchAntenna": {
                ...this.state.switchAntenna,
                "count": newValue
            }
        });

    }

    private _handleSwitchAntenna (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.switchAntennaDevice(this.state.switchAntenna).catch((err: Error): void => {

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

                <InputIntegerLabel label="Count"
                    required disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                    value={ this.state.switchAntenna.count }
                    onChange={ this._handleChangeSwitchAntennaCount.bind(this) }
                />

            </ModalBody>

            <ModalFooter>

                <Button variant="info" block
                    disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                    onClick={ this._handleSwitchAntenna.bind(this) }
                >
                    Execute
                </Button>

            </ModalFooter>

        </Modal>;

    }

};
