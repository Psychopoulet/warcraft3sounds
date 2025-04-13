"use strict";

// deps

    // externals
    import React from "react";
    import {
        Card, CardHeader, CardBody, CardFooter,
        Button
    } from "react-bootstrap-fontawesome";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

    // locals

    interface iGenerateRefAudioCallback {
        "setFocus": () => void;
        "ref": React.RefObject<HTMLAudioElement>;
        "startPlay": () => void;
        "pause": () => void;
        "unpause": () => void;
    }

// Props && States

    interface iStates {
        "status": "PLAY" | "PAUSE" | "STOP";
        "src": string;
    };

    interface iProps extends iPropsNode {
        "src": string;
    }

    function generateRefAudio (): iGenerateRefAudioCallback {

        const ref: React.RefObject<HTMLAudioElement> = React.createRef() as React.RefObject<HTMLAudioElement>;

        const setFocus = (): void => {
            ref.current && ref.current.focus();
        };

        const startPlay = (): void => {

            if (ref.current) {

                ref.current.currentTime = 0;
                ref.current.play();

            }

        };

        const pause = (): void => {

            if (ref.current && !ref.current.paused) {
                ref.current.pause();
            }

        };

        const unpause = (): void => {

            if (ref.current && ref.current.paused) {
                ref.current.play();
            }

        };

        return { setFocus, ref, startPlay, pause, unpause };

    }

// component

export default class SoundReader extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "SoundReader";

    // private

        private _refAudio: iGenerateRefAudioCallback;

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        this.state = {
            "status": "PLAY",
            "src": props.src.trim()
        };

        this._refAudio = generateRefAudio();

    }

    public componentDidMount (): void {

        this._refAudio.startPlay();

    }

    public static getDerivedStateFromProps (props: iProps, state: iStates): iStates | null {

        if (props.src !== state.src) {

            return {
                "status": "PLAY",
                "src": props.src
            };

        }

        return null;

    }

    public componentDidUpdate (prevProps: Readonly<iProps>, prevState: Readonly<iStates>): void {

        if (prevState.src !== this.state.src) {

            if ("" !== this.state.src) {

                this._refAudio.startPlay();

                this._refAudio.ref.current.onended = (): void => {

                    this.setState({
                        "status": "STOP"
                    });

                };

            }

        }

    }

    // events

    private _handlePlay (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.startPlay();

        this.setState({
            "status": "PLAY"
        });

    }

    private _handleUnpause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.unpause();

        this.setState({
            "status": "PLAY"
        });

    }

    private _handlePause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.pause();

        this.setState({
            "status": "PAUSE"
        });

    }

    // render

    private _renderButton (): React.JSX.Element {

        if ("PLAY" === this.state.status) {

            return <Button block variant="warning" icon="pause"
                onClick={ this._handlePause.bind(this) }
            >
                Pause
            </Button>;

        }
        else if ("PAUSE" === this.state.status) {

            return <Button block variant="success" icon="play"
                onClick={ this._handleUnpause.bind(this) }
            >
                Unpause
            </Button>;

        }
        else {

            return <Button block variant="success" icon="sync"
                onClick={ this._handlePlay.bind(this) }
            >
                Play again
            </Button>;

        }

    }

    public render (): React.JSX.Element {

        if (0 === this.state.src.length) {

            return <Card>

                <CardHeader>
                    Sound reader
                </CardHeader>

                <CardBody>
                    No sound to play
                </CardBody>

            </Card>;

        }

        return <Card>

            <CardHeader>
                Sound reader
            </CardHeader>

            <CardBody>

                { this.state.src }

                <audio id="audioSource" ref={ this._refAudio.ref } src={ this.state.src } >

                    Your browser does not support the <code>audio</code> element.

                </audio>

            </CardBody>

            <CardFooter>
                { this._renderButton() }
            </CardFooter>

        </Card>;

    }

};
