"use strict";

// made with the help of Le Chat - Mistral AI (https://chat.mistral.ai/)

// deps

    // externals
    import React from "react";
    import {
        Card, CardHeader, CardBody, CardFooter,
        Range,
        ButtonGroup, Button
    } from "react-bootstrap-fontawesome";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

    interface iStates {
        "status": "PLAY" | "PAUSE" | "STOP";
        "progress": number;
        "src": string;
    };

    interface iProps extends iPropsNode {
        "src": string;
        "title"?: string;
        "autoplay"?: boolean;
    }

// component

export default class SoundReader extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "SoundReader";

    // private

        private _refAudio: React.RefObject<HTMLAudioElement>;

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        const newSrc: string = props.src.trim();
        const startPlay: boolean = Boolean(this.props.autoplay) && 0 < newSrc.length;

        this.state = {
            "status": startPlay ? "PLAY" : "STOP",
            "progress": 0,
            "src": newSrc
        };

        // attributes

        this._refAudio = React.createRef() as React.RefObject<HTMLAudioElement>;

        // force binds

        this._handleMetaDataLoaded = this._handleMetaDataLoaded.bind(this);
        this._handleTimeUpdate = this._handleTimeUpdate.bind(this);
        this._handleEnded = this._handleEnded.bind(this);

    }

    public componentDidMount (): void {

        // init events

        this._refAudio.current.addEventListener("loadedmetadata", this._handleMetaDataLoaded);
        this._refAudio.current.addEventListener("timeupdate", this._handleTimeUpdate);
        this._refAudio.current.addEventListener("ended", this._handleEnded);

    }

    public componentWillUnmount (): void {

        // destroy events

        this._refAudio.current.removeEventListener("loadedmetadata", this._handleMetaDataLoaded);
        this._refAudio.current.removeEventListener("timeupdate", this._handleTimeUpdate);
        this._refAudio.current.removeEventListener("ended", this._handleEnded);

        // autostop

        this._refAudio.current.pause();

    }

    public static getDerivedStateFromProps (props: iProps, state: iStates): iStates | null {

        // props.src = new src
        // state.src = old src

        if (props.src !== state.src) { // src changed

            const newSrc: string = props.src.trim();
            const startPlay: boolean = Boolean(props.autoplay) && 0 < newSrc.length;

            return {
                "status": startPlay ? "PLAY" : "STOP",
                "progress": 0,
                "src": newSrc
            };

        }

        return null;

    }

    // events

    private _handleMetaDataLoaded (e: Event): void {

        // autoplay

        const startPlay: boolean = Boolean(this.props.autoplay) && 0 < this.state.src.length;

        if (startPlay) {
            this._handlePlay();
        }

    }

    private _handleTimeUpdate (): void {

        if (!Number.isNaN(this._refAudio.current.duration)) {

            const progressPercent = (this._refAudio.current.currentTime / this._refAudio.current.duration) * 100;

            this.setState({
                "progress": Math.round(progressPercent)
            });

        }

    }

    private _handlePlay (e?: React.MouseEvent<HTMLButtonElement>): void {

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        this._refAudio.current.currentTime = 0;
        this._refAudio.current.play();

        this.setState({
            "status": "PLAY",
            "progress": 0
        });

    }

    private _handlePause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        if (!this._refAudio.current.paused) {
            this._refAudio.current.pause();
        }

        this.setState({
            "status": "PAUSE"
        });

    }

    private _handleUnpause (e: React.MouseEvent<HTMLButtonElement>): void {

        e.stopPropagation();
        e.preventDefault();

        if (this._refAudio.current.paused) {
            this._refAudio.current.play();
        }

        this.setState({
            "status": "PLAY"
        });

    }

    private _handleStop (e?: React.MouseEvent<HTMLButtonElement>): void {

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        this._refAudio.current.pause();
        this._refAudio.current.currentTime = 0;

        this.setState({
            "status": "STOP",
            "progress": 0
        });

    }

    private _handleEnded (): void {
        this._handleStop();
    }

    // render

    private _renderHeader (): React.JSX.Element {

        if (this.props.title && 0 < this.props.title.length) {

            return <CardHeader>
                { this.props.title }
            </CardHeader>;

        }
        else if (0 < this.state.src.length) {

            return <CardHeader>
                { this.state.src.split("/").pop() }
            </CardHeader>;

        }
        else {

            return <CardHeader>Unknown</CardHeader>;

        }

    }

    private _renderBody (): React.JSX.Element {

        if (0 === this.state.src.length) {

            return <CardBody>

                <audio ref={ this._refAudio }>
                    Your browser does not support the <code>audio</code> element.
                </audio>

                No sound to play

            </CardBody>;

        }
        else {

            const max: number = Number.isNaN(this._refAudio.current.duration) || undefined === this._refAudio.current.duration ? 100 : Math.round(this._refAudio.current.duration);

            return <CardBody>

                <audio ref={ this._refAudio } src={ this.state.src } >
                    Your browser does not support the <code>audio</code> element.
                </audio>

                <div className="input-group">

                    <span className="input-group-text">{ this.state.progress }%</span>

                    <Range value={ Math.round(this._refAudio.current.currentTime) } min={ 0 } max={ max } />

                </div>

            </CardBody>;

        }

    }

    private _renderFooter (): React.JSX.Element | undefined {

        if (0 === this.state.src.length) {

            return undefined;

        }
        else if ("PLAY" === this.state.status) {

            return <CardFooter>

                    <ButtonGroup block>

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

                </ButtonGroup>

            </CardFooter>;

        }
        else if ("PAUSE" === this.state.status) {

            return <CardFooter>

                <ButtonGroup block>

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

                </ButtonGroup>

            </CardFooter>;

        }
        else {

            return <CardFooter>

                <Button block variant="success" icon="sync"
                    onClick={ this._handlePlay.bind(this) }
                >
                    Play again
                </Button>

            </CardFooter>;

        }

    }

    public render (): React.JSX.Element {

        return <Card>

            { this._renderHeader() }
            { this._renderBody() }
            { this._renderFooter() }

        </Card>;

    }

};
