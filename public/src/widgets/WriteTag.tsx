"use strict";

// deps

    // externals
    import * as React from "react";
    import {
        Modal, ModalBody, ModalFooter,
        InputIntegerLabel, InputTextLabel,
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
        iWriteTagRequestOrResult
    } from "../wrapper/RFIDNedapWrapper";

// Props && States

    interface iProps extends iPropsNode {
        "commandRunning": tCommandRunning;
        "wrapper": RFIDNedapWrapper;
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void
    };

    interface iStates {
        "commandRunning": tCommandRunning;
		"tag": iWriteTagRequestOrResult;
    };

// component

export default class WriteTag extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "WriteTag";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "commandRunning": this.props.commandRunning,
			"tag": {
				"key": 0,
				"content": ""
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

    private _handleChangeTagKey (e: React.ChangeEvent<HTMLInputElement>, newValue: number): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "tag": {
                ...this.state.tag,
                "key": newValue
            }
        });

    }

    private _handleChangeTagContent (e: React.ChangeEvent<HTMLInputElement>, newValue: string): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "tag": {
                ...this.state.tag,
                "content": newValue
            }
        });

    }

    private _handleTag (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.props.wrapper.writeTagDevice(this.state.tag).catch((err: Error): void => {

            console.error(err);
            alert(err.message ? err.message : err);

        });

    }

    // render

    public render (): JSX.Element {

        return <Modal appId="app" centered size="md"
            title="Write tag"
            onClose={ this.props.onClose }
        >

            <ModalBody className="pb-0">

                <div className="row">

                    <div className="col-12 col-md-6">

                        <InputIntegerLabel label="Key"
                            required disabled={ "NONE" !== this.state.commandRunning }
                            value={ this.state.tag.key }
                            onChange={ this._handleChangeTagKey.bind(this) }
                        />

                    </div>

                    <div className="col-12 col-md-6">

                        <InputTextLabel label="Content"
                            required disabled={ "NONE" !== this.state.commandRunning }
                            value={ this.state.tag.content }
                            onChange={ this._handleChangeTagContent.bind(this) }
                        />

                    </div>

                </div>

            </ModalBody>

            <ModalFooter>

                <Button variant="info" block
                    disabled={ "NONE" !== this.state.commandRunning }
                    onClick={ this._handleTag.bind(this) }
                >
                    Execute
                </Button>

            </ModalFooter>

        </Modal>;

    }

};
