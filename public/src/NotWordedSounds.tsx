// deps

    // externals
    import React from "react";

// types & interfaces

    // shared by Menu (write) and Race (read); the flag is not stored anywhere else
    interface iNotWordedSoundsContext {
        "notWordedSounds": boolean;
        "setNotWordedSounds": (value: boolean) => void;
    }

// Props && States

    interface iProps {
        "children": React.ReactNode;
    }

    interface iStates {
        "notWordedSounds": boolean;
    }

// component

// outside the provider the checkbox stays off and toggling it does nothing
export const NotWordedSoundsContext: React.Context<iNotWordedSoundsContext> = React.createContext<iNotWordedSoundsContext>({
    "notWordedSounds": false,
    "setNotWordedSounds": (): void => {
        // no-op until a provider mounts
    }
});

// single owner of the flag
export class NotWordedSoundsProvider extends React.Component<iProps, iStates> {

    // name

        public static displayName: string = "NotWordedSoundsProvider";

    // constructor

    public constructor (props: iProps) {

        super(props);

        // states

        // same default as the context: the checkbox starts unchecked
        this.state = {
            "notWordedSounds": false
        };

    }

    // events

    // Menu writes here; Race reads the flag only on the next character fetch
    private _setNotWordedSounds (value: boolean): void {

        this.setState({
            "notWordedSounds": value
        });

    }

    // render

    public render (): React.JSX.Element {

        // a new value object makes context consumers re-render when the flag changes
        return <NotWordedSoundsContext.Provider value={{
            "notWordedSounds": this.state.notWordedSounds,
            "setNotWordedSounds": this._setNotWordedSounds.bind(this)
        }}>

            { this.props.children }

        </NotWordedSoundsContext.Provider>;

    }

}
