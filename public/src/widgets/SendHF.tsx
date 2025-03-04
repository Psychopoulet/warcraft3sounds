"use strict";

// deps

    // externals
    import * as React from "react";
    import {
        Modal, ModalFooter,
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
        tCommandRunning
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
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
            "commandRunning": this.props.commandRunning
        };

    }

    static getDerivedStateFromProps(nextProps: iProps, prevState: iStates): iStates {

        return {
            ...prevState,
            "commandRunning": nextProps.commandRunning
        };

    }

    // events handlers

    private _handleSendHFAFI (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.sendHFAFIDevice().catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    private _handleSendHFEAS (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.sendHFEASDevice().catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    // render

    public render (): JSX.Element {

        return <Modal appId="app" centered size="md"
            title="Send HF"
            onClose={ this.props.onClose }
        >

            <ModalFooter>

                <ButtonGroup block>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                        onClick={ this._handleSendHFAFI.bind(this) }
                    >
                        AFI
                    </Button>

                    <Button variant="info"
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
                        onClick={ this._handleSendHFEAS.bind(this) }
                    >
                        EAS
                    </Button>

                </ButtonGroup>

            </ModalFooter>

        </Modal>;

    }

};
