"use strict";

// types & interfaces

    // locals
    import type { components } from "../../lib/src/descriptor";
    export type descriptorTypes = components["schemas"];

// component

export class SDK {

    public getIps (): Promise<components["schemas"]["IP"][]> {

        return fetch("/api/ips").then((content: Response): Promise<components["schemas"]["IP"][]> => {

            return content.json();

        });

    }

    public getRaces (): Promise<Array<descriptorTypes["BasicRace"]>> {

        return fetch("/api/races").then((content: Response): Promise<Array<descriptorTypes["BasicRace"]>> => {

            return content.json();

        });

    }

    public getRace (raceCode: components["schemas"]["Race"]["code"]): Promise<components["schemas"]["Race"]> {

        return fetch("/api/races/" + raceCode).then((content: Response): Promise<components["schemas"]["Race"]> => {

            return content.json();

        });

    }

    public getCharacter (raceCode: components["schemas"]["Race"]["code"], characterCode: components["schemas"]["Character"]["code"], notworded?: boolean): Promise<components["schemas"]["Character"]> {

        return fetch("/api/races/" + raceCode + "/characters/" + characterCode + "?notworded=" + (notworded ? "true" : "false")).then((content: Response): Promise<components["schemas"]["Character"]> => {

            return content.json();

        });

    }

}

let _sdk: SDK | null = null;

export default function getSDK (): SDK {

    if (null === _sdk) {
        _sdk = new SDK();
    }

    return _sdk;

}
