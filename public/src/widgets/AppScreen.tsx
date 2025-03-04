"use strict";

// deps

    // externals
    import * as React from "react";

    // locals

        // wrapper
        import RFIDNedapWrapper from "../wrapper/RFIDNedapWrapper";

        // widgets
        import AScreen from "../../../../../web/widgets/Screen";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals

    import type {
        tPushEvent,
        iPushMessageError,
        iPushMessageDeviceUpdate, iPushMessageDeviceUpdateFail
    } from "../wrapper/RFIDNedapWrapper";

    import type { iLog } from "../../../../../web/widgets/Screen";

// Props && States

    interface iProps extends iPropsNode {
        "history"?: boolean;
        "wrapper": RFIDNedapWrapper;
    };

    interface iStates {
        "messages": iLog[];
    };

// component

export default class AppScreen extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "AppScreen";

    // attributes

        // private

            private _onMessage: tPushEvent | null;

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "messages": [
                {
                    "type": "success",
                    "content": "Connected",
                    "datetime": AScreen.formateCurrentDate()
                }
            ]
        };

        // states manager

        this._onMessage = null;

    }

    public componentDidMount (): void {

        // states managers

        this._onMessage = (msg: string): void => {

            type tMessage = iPushMessageError |
            iPushMessageDeviceUpdate | iPushMessageDeviceUpdateFail;

            const { plugin, command, data }: tMessage = JSON.parse(msg) as tMessage;

            if (RFIDNedapWrapper.PLUGIN_NAME === plugin) {

                switch (command) {

                    // iPushMessageError

                    case "error":

                        this.setState({
                            "messages": [
                                {
                                    "type": "danger",
                                    "content": data,
                                    "datetime": AScreen.formateCurrentDate()
                                },
                                ...this.state.messages
                            ]
                        });

                    break;

                    // iPushMessageDeviceUpdate

                    case "device.connect.success":

                        this.setState({
                            "messages": [
                                {
                                    "type": "success",
                                    "content": "Device connected",
                                    "datetime": AScreen.formateCurrentDate()
                                },
                                ...this.state.messages
                            ]
                        });

                    break;

                    case "device.disconnect.success":

                        this.setState({
                            "messages": [
                                {
                                    "type": "warning",
                                    "content": "Device disconnected",
                                    "datetime": AScreen.formateCurrentDate()
                                },
                                ...this.state.messages
                            ]
                        });

                    break;

                    // iPushMessageDeviceUpdateFail

                    case "device.connect.fail":
                    case "device.disconnect.fail":
                    case "device.power.fail":
                    case "device.buzzer.fail":
                    case "device.light.on.fail":
                    case "device.light.off.fail":
                    case "device.inventory-start.fail":
                    case "device.inventory-restart.fail":
                    case "device.inventory-stop.fail":
                    case "device.hf-afi.fail":
                    case "device.hf-eas.fail":
                    case "device.write-tag.fail":
                    case "device.watchdog-tick.fail":
                    case "device.watchdog-stop.fail":

                        this.setState({
                            "messages": [
                                {
                                    "type": "danger",
                                    "content": data,
                                    "datetime": AScreen.formateCurrentDate()
                                },
                                ...this.state.messages
                            ]
                        });

                    break;

                    // default

                    default:
                        // nothing to do here
                    break;

                }

            }

        };

        this.props.wrapper.on("message", this._onMessage);

    }

    public componentWillUnmount (): void {

        if (this._onMessage) {
            this.props.wrapper.removeListener("message", this._onMessage);
            this._onMessage = null;
        }

        this.setState({
            "messages": []
        });

    }

    // events handlers

    private _handleClear (e: React.MouseEvent<HTMLButtonElement>): void {

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            "messages": []
        });

    }

    // render

    public render (): JSX.Element {

        return <AScreen id={ this.props.id } className={ this.props.className } style={ this.props.style }
            history={ Boolean(this.props.history) }
            messages={ this.state.messages }
            onClear={ this._handleClear.bind(this) }
        />;

    }

};
