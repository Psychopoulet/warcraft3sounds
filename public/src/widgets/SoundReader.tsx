"use strict";

// deps

    // externals
    import React from "react";
    import {
        Card, CardHeader, CardBody, CardFooter,
        ButtonGroup, Button
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
        "stop": () => void;
    }

// Props && States

    interface iStates {
        "status": "PLAY" | "PAUSE" | "STOP";
        "isPlaying": boolean;
        "progress": number;
        "src": string;
    };

    interface iProps extends iPropsNode {
        "src": string;
        "title"?: string;
        "autoplay"?: boolean;
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

        const stop = (): void => {

            if (ref.current) {

                ref.current.pause();
                ref.current.currentTime = 0;

            }

        };

        return { setFocus, ref, startPlay, pause, unpause, stop };

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

        const newSrc: string = props.src.trim();
        const startPlay: boolean = Boolean(this.props.autoplay) && 0 < newSrc.length;

        this.state = {
            "status": startPlay ? "PLAY" : "STOP",
            "isPlaying": startPlay ? true : false,
            "progress": 0,
            "src": newSrc
        };

        this._refAudio = generateRefAudio();

    }

    public componentDidMount (): void {

        // init events

        this._refAudio.ref.current.addEventListener("timeupdate", this._handleTimeUpdate.bind(this));
        this._refAudio.ref.current.addEventListener("ended", this._handleEnded.bind(this));

        // autoplay

        const startPlay: boolean = Boolean(this.props.autoplay) && 0 < this.state.src.length;

        if (startPlay) {
            this._refAudio.startPlay();
        }

    }

    public componentWillUnmount (): void {

        // destroy events

        this._refAudio.ref.current.removeEventListener("timeupdate", this._handleTimeUpdate.bind(this));
        this._refAudio.ref.current.removeEventListener("ended", this._handleEnded.bind(this));

        // autostop

        this._refAudio.stop();

    }

    public static getDerivedStateFromProps (props: iProps, state: iStates): iStates | null {

        // props.src = new src
        // state.src = old src

        if (props.src !== state.src) { // src changed

            const newSrc: string = props.src.trim();
            const startPlay: boolean = Boolean(props.autoplay) && 0 < newSrc.length;

            return {
                "status": startPlay ? "PLAY" : "STOP",
                "isPlaying": startPlay ? true : false,
                "progress": 0,
                "src": newSrc
            };

        }

        return null;

    }

    public componentDidUpdate (prevProps: Readonly<iProps>, prevState: Readonly<iStates>): void {

        if (prevState.src !== this.state.src) {

            const startPlay: boolean = Boolean(this.props.autoplay) && 0 < this.state.src.length;

            if (startPlay) {
                this._refAudio.startPlay();
            }

        }

    }

    // events

    private _handlePlay (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.startPlay();

        this.setState({
            "status": "PLAY",
            "isPlaying": true,
            "progress": 0
        });

    }

    private _handleUnpause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.unpause();

        this.setState({
            "status": "PLAY",
            "isPlaying": true
        });

    }

    private _handlePause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.pause();

        this.setState({
            "status": "PAUSE",
            "isPlaying": false
        });

    }

    private _handleStop (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        this._refAudio.stop();
        this._handleEnded();

    }

    // private _handleTimeUpdate (audioElement: HTMLAudioElement, e: Event): void {
    private _handleTimeUpdate (): void {

        const currentTime = this._refAudio.ref.current.currentTime;
        const duration = this._refAudio.ref.current.duration;
        const progressPercent = (currentTime / duration) * 100;

        this.setState({
            "progress": progressPercent
        });

    }

    // private _handleEnded (audioElement: HTMLAudioElement, e: Event): void {
    private _handleEnded (): void {

        this.setState({
            "status": "STOP",
            "isPlaying": false,
            "progress": 0
        });

    }

    // render

    private _renderButton (): React.JSX.Element {

        if ("PLAY" === this.state.status) {

            return <ButtonGroup block>

                <Button variant="warning" icon="pause"
                    onClick={ this._handlePause.bind(this) }
                >
                    Pause
                </Button>

                <Button variant="danger" icon="stop"
                    onClick={ this._handleStop.bind(this) }
                >
                    Stop
                </Button>

            </ButtonGroup>;

        }
        else if ("PAUSE" === this.state.status) {

            return <ButtonGroup block>

                <Button variant="success" icon="play"
                    onClick={ this._handleUnpause.bind(this) }
                >
                    Play
                </Button>

                <Button variant="danger" icon="stop"
                    onClick={ this._handleStop.bind(this) }
                >
                    Stop
                </Button>

            </ButtonGroup>;

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

        let title: string;

        if (this.props.title && 0 < this.props.title.length) {
            title = this.props.title;
        }
        else if (0 < this.state.src.length) {
            title = this.state.src.split("/").pop() as string;
        }
        else {
            title = "Unknown";
        }

        if (0 === this.state.src.length) {

            return <Card>

                <CardHeader>
                    { title }
                </CardHeader>

                <CardBody>

                    No sound to play

                    <audio ref={ this._refAudio.ref }>
                        Your browser does not support the <code>audio</code> element.
                    </audio>

                </CardBody>

            </Card>;

        }

        return <Card>

            <CardHeader>
                { title }
            </CardHeader>

            <CardBody>

                { this.state.progress }

                <audio ref={ this._refAudio.ref } src={ this.state.src } >
                    Your browser does not support the <code>audio</code> element.
                </audio>

            </CardBody>

            <CardFooter>
                { this._renderButton() }
            </CardFooter>

        </Card>;

    }

};
