"use strict";

// deps

	// externals
	import * as React from "react";
	import {
		Card, CardHeader, CardBody, CardTable, CardFooter,
        TableHeader, TableBody,
        Icon,
		CheckBoxLabel,
        ButtonGroup, Button
	} from "react-bootstrap-fontawesome";

	// locals

		// wrapper
		import RFIDNedapWrapper from "../wrapper/RFIDNedapWrapper";

        // widgets
        import Buzzer from "./Buzzer";
        import Light from "./Light";
        import Power from "./Power";
        import SendHF from "./SendHF";
        import SwitchAntenna from "./SwitchAntenna";
        import WriteTag from "./WriteTag";
        import WatchDog from "./WatchDog";

// types & interfaces

	// externals
	import type { iPropsNode } from "react-bootstrap-fontawesome";

	// locals
    import type {

		tCommandRunning,
		iInventoryRequestOrResult,
		iTag,

		tPushEvent,

		iPushMessageDeviceUpdate, iPushMessageDeviceUpdateFail,
		iPushMessageDevicePowerRunningOrSuccess,
		iPushMessageDeviceBuzzerRunningOrSuccess,
		iPushMessageDeviceLightOnRunningOrSuccess, iPushMessageDeviceLightOffRunningOrSuccess,
		iPushMessageDeviceInventoryRunning, iPushMessageDeviceInventorySuccess,
		iPushMessageDeviceWriteTagRunning, iPushMessageDeviceWriteTagSuccess,
		iPushMessageDeviceWatchdogStartRunning, iPushMessageDeviceWatchdogStartSuccess,
		iPushMessageDeviceWatchdogRunning, iPushMessageDeviceWatchdogSuccess,
		iPushMessageDeviceSwitchAntennaRunning, iPushMessageDeviceSwitchAntennaSuccess,
		iPushMessageDeviceUpdatedTags

	} from "../wrapper/RFIDNedapWrapper";

// Props && States

	interface iProps extends iPropsNode {
		"wrapper": RFIDNedapWrapper;
	};

	interface iStates {
		"loading": boolean;
		"commandRunning": tCommandRunning;
		"connected": boolean;
		"inventory": iInventoryRequestOrResult;
        "openBuzzer": boolean;
        "openLight": boolean;
        "openPower": boolean;
        "openSendHF": boolean;
        "openSwitchAntenna": boolean;
        "openWatchDog": boolean;
        "openWriteTag": boolean;
		"tags": iTag[];
	};

// component

export default class Device extends React.Component<iProps, iStates> {

	// name

		public static displayName: string = "Device";

	// attributes

		// private

			private _onMessage: tPushEvent | null;

	// constructor

	public constructor (props: iProps) {

		super(props);

		// states

		this.state = {
			"loading": true,
			"commandRunning": "NONE",
			"connected": false,
			"inventory": {
				"iso-15693": false,
				"uhf": true
			},
            "openBuzzer": false,
            "openLight": false,
            "openSendHF": false,
            "openSwitchAntenna": false,
            "openPower": false,
            "openWatchDog": false,
            "openWriteTag": false,
            "tags": []
		};

		// states manager

		this._onMessage = null;

	}

	public componentDidMount (): void {

		// states managers

		this._onMessage = (msg: string): void => {

			type tMessage = iPushMessageDeviceUpdate | iPushMessageDeviceUpdateFail
			| iPushMessageDevicePowerRunningOrSuccess
			| iPushMessageDeviceBuzzerRunningOrSuccess
			| iPushMessageDeviceLightOnRunningOrSuccess | iPushMessageDeviceLightOffRunningOrSuccess
			| iPushMessageDeviceInventoryRunning | iPushMessageDeviceInventorySuccess
			| iPushMessageDeviceWriteTagRunning | iPushMessageDeviceWriteTagSuccess
			| iPushMessageDeviceWatchdogStartRunning | iPushMessageDeviceWatchdogStartSuccess
			| iPushMessageDeviceWatchdogRunning | iPushMessageDeviceWatchdogSuccess
			| iPushMessageDeviceSwitchAntennaRunning | iPushMessageDeviceSwitchAntennaSuccess
			| iPushMessageDeviceUpdatedTags;

			const { plugin, command, data }: tMessage = JSON.parse(msg) as tMessage;

			if (RFIDNedapWrapper.PLUGIN_NAME === plugin) {

				switch (command) {

					case "device.connect.running":

						this.setState({
							"commandRunning": "CONNECT",
							"connected": false
						});

					break;

					case "device.connect.success":

						this.setState({
							"commandRunning": "NONE",
							"connected": true
						});

					break;

					case "device.connect.fail":

						this.setState({
							"commandRunning": "NONE",
							"connected": false
						});

					break;

					case "device.disconnect.running":

						this.setState({
							"commandRunning": "DISCONNECT",
							"connected": true
						});

					break;

					case "device.disconnect.success":

						this.setState({
							"commandRunning": "NONE",
							"connected": false
						});

					break;

					case "device.disconnect.fail":

						this.setState({
							"commandRunning": "NONE",
							"connected": true
						});

					break;

					case "device.power.running":

						this.setState({
							"commandRunning": "POWER"
						});

					break;

					case "device.buzzer.running":

						this.setState({
							"commandRunning": "BUZZER"
						});

					break;

					case "device.light.on.running":

						this.setState({
							"commandRunning": "LIGHT-ON"
						});

					break;

					case "device.light.off.running":

						this.setState({
							"commandRunning": "LIGHT-OFF"
						});

					break;

					case "device.inventory-start.running":

						this.setState({
							"commandRunning": "INVENTORY-START"
						});

					break;

					case "device.inventory-restart.running":

						this.setState({
							"commandRunning": "INVENTORY-RESTART"
						});

					break;

					case "device.inventory-stop.running":

						this.setState({
							"commandRunning": "INVENTORY-STOP"
						});

					break;

					case "device.write-tag.running":

						this.setState({
							"commandRunning": "WRITE-TAG"
						});

					break;

					case "device.watchdog-start.running":

						this.setState({
							"commandRunning": "WATCHDOG-START"
						});

					break;

					case "device.watchdog-tick.running":

						this.setState({
							"commandRunning": "WATCHDOG-TICK"
						});

					break;

					case "device.watchdog-stop.running":

						this.setState({
							"commandRunning": "WATCHDOG-STOP"
						});

					break;

					case "device.switch-antenna.running":

						this.setState({
							"commandRunning": "SWITCH-ANTENNA"
						});

					break;

					case "device.clear-tags.running":

						this.setState({
							"commandRunning": "CLEAR-TAGS"
						});

					break;

					case "device.inventory-start.success":
					case "device.inventory-restart.success":
					case "device.inventory-stop.fail":

						this.setState({
							"commandRunning": "INVENTORY"
						});

					break;

					case "device.watchdog-start.success":
					case "device.watchdog-tick.success":
					case "device.watchdog-tick.fail":
					case "device.watchdog-stop.fail":

						this.setState({
							"commandRunning": "WATCHDOG"
						});

					break;

					case "device.power.success":
					case "device.power.fail":

					case "device.buzzer.success":
					case "device.buzzer.fail":

					case "device.light.on.success":
					case "device.light.on.fail":

					case "device.light.off.success":
					case "device.light.off.fail":

					case "device.inventory-start.fail":

					case "device.inventory-restart.success":
					case "device.inventory-restart.fail":

					case "device.inventory-stop.success":

					case "device.write-tag.success":
					case "device.write-tag.fail":

					case "device.watchdog-start.success":
					case "device.watchdog-start.fail":

					case "device.watchdog-tick.success":

					case "device.watchdog-stop.success":
					case "device.watchdog-stop.fail":

					case "device.switch-antenna.success":
					case "device.switch-antenna.fail":

					case "device.clear-tags.fail":

						this.setState({
							"commandRunning": "NONE"
						});

					break;

					case "device.clear-tags.success":

						this.setState({
							"commandRunning": "NONE",
							"tags": []
						});

					break;

					case "device.tags.updated":

						this.setState({
							"tags": data
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

		// events handlers

		this._handleRefresh();

	}

	public componentWillUnmount (): void {

		if (this._onMessage) {
			this.props.wrapper.removeListener("message", this._onMessage);
			this._onMessage = null;
		}

	}

	// events handlers

	private _handleChangeInventoryIso (e: React.ChangeEvent<HTMLInputElement>, newValue: boolean): void {

		this.setState({
			"inventory": {
				...this.state.inventory,
				"iso-15693": newValue
			}
		});

	}

	private _handleChangeInventoryUhf (e: React.ChangeEvent<HTMLInputElement>, newValue: boolean): void {

		this.setState({
			"inventory": {
				...this.state.inventory,
				"uhf": newValue
			}
		});

	}

	private _handleRefresh (): void {

		this.setState({
			"loading": true
		});

		this.props.wrapper.isConnectedDevice().then((connected: boolean): Promise<void> => {

			return this.props.wrapper.getCommandRunning().then((commandRunning: tCommandRunning): void => {

				this.setState({
					"loading": false,
					"connected": connected,
					"commandRunning": commandRunning
				});

			});

		}).catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

			this.setState({
				"loading": false
			});

		});

	}

	private _handleConnect (e: React.MouseEvent<HTMLButtonElement>): void {

		this.props.wrapper.connectDevice().catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleDisconnect (e: React.MouseEvent<HTMLButtonElement>): void {

		this.props.wrapper.disconnectDevice().catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleInventoryStart (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

		this.props.wrapper.startInventoryDevice(this.state.inventory).catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleInventoryRestart (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

		this.props.wrapper.restartInventoryDevice(this.state.inventory).catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleInventoryStop (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

		this.props.wrapper.stopInventoryDevice(this.state.inventory).catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleClearTags (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

		this.props.wrapper.clearTagsDevice().catch((err: Error): void => {

			console.error(err);
			alert(err.message ? err.message : err);

		});

	}

	private _handleOpenBuzzer (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openBuzzer": true
        });

	}

	private _handleCloseBuzzer (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openBuzzer": false
        });

	}

	private _handleOpenLight (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openLight": true
        });

	}

	private _handleCloseLight (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openLight": false
        });

	}

	private _handleOpenSendHF (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openSendHF": true
        });

	}

	private _handleCloseSendHF (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openSendHF": false
        });

	}

	private _handleOpenSwitchAntenna (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openSwitchAntenna": true
        });

	}

	private _handleCloseSwitchAntenna (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openSwitchAntenna": false
        });

	}

	private _handleOpenPower (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openPower": true
        });

	}

	private _handleClosePower (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openPower": false
        });

	}

	private _handleOpenWatchDog (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openWatchDog": true
        });

	}

	private _handleCloseWatchDog (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openWatchDog": false
        });

	}

	private _handleOpenWriteTags (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openWriteTag": true
        });

	}

	private _handleCloseWriteTags (e: React.MouseEvent<HTMLButtonElement>): void {

		e.preventDefault();
		e.stopPropagation();

        this.setState({
            "openWriteTag": false
        });

	}

	// render

	private _renderListTags (): JSX.Element | undefined {

		if ("INVENTORY" !== this.state.commandRunning) {
			return;
		}

		return <Card>

			<CardHeader>Tags list</CardHeader>

			<CardTable>

				<TableHeader>

					<tr>

						<th>AFI</th>
						<th>Count</th>
						<th>DSFID</th>
						<th>EAS</th>
						<th>EPC</th>
						<th>FirstReadingTime</th>
						<th>Freq</th>
						<th>INFO</th>
						<th>IsOk</th>
						<th>LastReadingTime</th>
						<th>LastRssi</th>
						<th>LastStatusUpdateTime</th>
						<th>MEM_RESERVED</th>
						<th>MEM_TID</th>
						<th>MEM_USER</th>
						<th>PCW</th>
						<th>RssiMin</th>
						<th>RssiMax</th>

					</tr>

				</TableHeader>

				<TableBody>

					{ this.state.tags.map((tag: iTag): JSX.Element => {

						return <tr>

							<td>{ tag.AFI }</td>
							<td>{ tag.Count }</td>
							<td>{ tag.DSFID }</td>
							<td>{ tag.EAS }</td>
							<td>{ tag.EPC }</td>
							<td>{ tag.FirstReadingTime }</td>
							<td>{ tag.Freq }</td>
							<td>{ tag.INFO }</td>
							<td>{ tag.IsOk ? <Icon type="check" variant="success" /> : <Icon type="times" variant="danger" /> }</td>
							<td>{ tag.LastReadingTime }</td>
							<td>{ tag.LastRssi }</td>
							<td>{ tag.LastStatusUpdateTime }</td>
							<td>{ tag.MEM_RESERVED }</td>
							<td>{ tag.MEM_TID }</td>
							<td>{ tag.MEM_USER }</td>
							<td>{ tag.PCW }</td>
							<td>{ tag.RssiMin }</td>
							<td>{ tag.RssiMax }</td>

						</tr>;

					}) }

				</TableBody>

			</CardTable>

			<CardFooter>

				<ButtonGroup block>

					<Button variant="info"
						disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) }
						onClick={ this._handleInventoryStop.bind(this) }
					>
						Stop
					</Button>

					<Button variant="warning"
						disabled={ ![ "NONE", "INVENTORY" ].includes(this.state.commandRunning) }
						onClick={ this._handleClearTags.bind(this) }
					>
						Clear tags
					</Button>

				</ButtonGroup>

			</CardFooter>

		</Card>;

	}

	public render (): JSX.Element {

		if (this.state.loading) {

			return <Card id={ this.props.id } className={ this.props.className } style={ this.props.style }
				variant="warning"
			>
				<CardBody>Loading status...</CardBody>
			</Card>;

		}
		else if (!this.state.connected) {

			return <Button id={ this.props.id } className={ this.props.className } style={ this.props.style }
				title="Connect device"
				icon="play" variant="success" block
				disabled={ "NONE" !== this.state.commandRunning }
				onClick={ this._handleConnect.bind(this) }
			>
				Connect device
			</Button>;

		}
		else {

			return <>

                { this.state.openBuzzer
                    ? <Buzzer
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseBuzzer.bind(this) }
                    />
                    : undefined
                }

                { this.state.openLight
                    ? <Light
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseLight.bind(this) }
                    />
                    : undefined
                }

                { this.state.openPower
                    ? <Power
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleClosePower.bind(this) }
                    />
                    : undefined
                }

                { this.state.openSendHF
                    ? <SendHF
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseSendHF.bind(this) }
                    />
                    : undefined
                }

                { this.state.openSwitchAntenna
                    ? <SwitchAntenna
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseSwitchAntenna.bind(this) }
                    />
                    : undefined
                }

                { this.state.openWatchDog
                    ? <WatchDog
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseWatchDog.bind(this) }
                    />
                    : undefined
                }

                { this.state.openWriteTag
                    ? <WriteTag
                        commandRunning={ this.state.commandRunning }
                        wrapper={ this.props.wrapper }
                        onClose={ this._handleCloseWriteTags.bind(this) }
                    />
                    : undefined
                }

				<div className="row">

					<div className="col-12 col-sm-4 col-md-3 col-lg-2 col-xl-1 text-center">

						{ this.state.commandRunning }

					</div>

					<div className="col-12 col-sm-8 col-md-9 col-lg-10 col-xl-11">

						<Button className="mb-3"
							title="Disconnect device"
							icon="stop" variant="warning" block
							disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openLight }
							onClick={ this._handleDisconnect.bind(this) }
						>
							Disconnect device
						</Button>

					</div>

                </div>

                <ButtonGroup block className="mb-3">

                    <Button icon="volume-up" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openLight }
                        onClick={ this._handleOpenBuzzer.bind(this) }
                    >
                        Open "buzzer" menu
                    </Button>

                    <Button icon="lightbulb" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openLight }
                        onClick={ this._handleOpenLight.bind(this) }
                    >
                        Open "light" menu
                    </Button>

                    <Button icon="wifi" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openPower }
                        onClick={ this._handleOpenPower.bind(this) }
                    >
                        Open "power" menu
                    </Button>

                </ButtonGroup>

                <ButtonGroup block className="mb-3">

                    <Button icon="eye" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openWatchDog }
                        onClick={ this._handleOpenWatchDog.bind(this) }
                    >
                        Open "watchdog" menu
                    </Button>

                    <Button icon="microchip" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openWriteTag }
                        onClick={ this._handleOpenWriteTags.bind(this) }
                    >
                        Open "write tags" menu
                    </Button>

                </ButtonGroup>

                <ButtonGroup block className="mb-3">

                    <Button variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openWatchDog }
                        onClick={ this._handleOpenSendHF.bind(this) }
                    >
                        Open "send hf" menu
                    </Button>

                    <Button icon="sync" variant="info" block
                        disabled={ ![ "NONE", "INVENTORY", "WATCHDOG" ].includes(this.state.commandRunning) || this.state.openWriteTag }
                        onClick={ this._handleOpenSwitchAntenna.bind(this) }
                    >
                        Open "swith antenna" menu
                    </Button>

                </ButtonGroup>

                <Card className="mb-3">

                    <CardHeader>Inventory</CardHeader>

                    <CardBody className="pb-0">

                        <div className="row">

                            <div className="col-12 col-md-6">

                                <CheckBoxLabel label="iso-15693"
                                    disabled={ ![ "NONE", "WATCHDOG" ].includes(this.state.commandRunning) }
                                    checked={ this.state.inventory["iso-15693"] }
                                    onToogle={ this._handleChangeInventoryIso.bind(this) }
                                />

                            </div>

                            <div className="col-12 col-md-6">

                                <CheckBoxLabel label="uhf"
                                    disabled={ ![ "NONE", "WATCHDOG" ].includes(this.state.commandRunning) }
                                    checked={ this.state.inventory["uhf"] }
                                    onToogle={ this._handleChangeInventoryUhf.bind(this) }
                                />

                            </div>

                        </div>

                    </CardBody>

                    <CardFooter>

                        <ButtonGroup block>

                            <Button variant="info"
                                disabled={ ![ "NONE", "WATCHDOG" ].includes(this.state.commandRunning) }
                                onClick={ this._handleInventoryStart.bind(this) }
                            >
                                Start
                            </Button>

                            <Button variant="info"
                                disabled={ ![ "NONE", "WATCHDOG" ].includes(this.state.commandRunning) }
                                onClick={ this._handleInventoryRestart.bind(this) }
                            >
                                Restart
                            </Button>

                        </ButtonGroup>

                    </CardFooter>

                </Card>

                { this._renderListTags() }

			</>;

		}

	}

};
