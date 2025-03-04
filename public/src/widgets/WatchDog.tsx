"use strict";

// deps

    // externals
    import * as React from "react";
    import {
        Modal, ModalBody, ModalFooter,
        InputIntegerLabel,
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
        iStartWatchdogRequestOrResult
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
		"watchdog": iStartWatchdogRequestOrResult;
    };

// component

export default class WatchDog extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "WatchDog";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "commandRunning": this.props.commandRunning,
			"watchdog": {
				"period": 4
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

    private _handleChangeWatchdogPeriod (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "watchdog": {
                ...this.state.watchdog,
                "period": newValue
            }
        });

    }

    private _handleWatchdogStart (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.startWatchdogDevice(this.state.watchdog).catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    private _handleWatchdogTick (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.tickWatchdogDevice().catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    private _handleWatchdogStop (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.stopWatchdogDevice().catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    // render

    public render (): JSX.Element {

        return <Modal appId="app" centered size="md"
            title="Watchdog"
            onClose={ this.props.onClose }
        >

            <ModalBody className="pb-0">

                <InputIntegerLabel label="Period"
                    required disabled={ "NONE" !== this.state.commandRunning }
                    value={ this.state.watchdog.period }
                    onChange={ this._handleChangeWatchdogPeriod.bind(this) }
                />

            </ModalBody>

            <ModalFooter>

                <ButtonGroup block>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
                        onClick={ this._handleWatchdogStart.bind(this) }
                    >
                        Start
                    </Button>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                        onClick={ this._handleWatchdogTick.bind(this) }
                    >
                        Tick
                    </Button>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                        onClick={ this._handleWatchdogStop.bind(this) }
                    >
                        Stop
                    </Button>

                </ButtonGroup>

            </ModalFooter>

        </Modal>;

    }

};
