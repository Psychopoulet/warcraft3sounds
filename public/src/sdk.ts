"use strict";

// types & interfaces

    // locals
    import type { iIp, iRace } from "../../lib/src/api/model";
    export type { iIp, iRace };

// component

export class SDK {

    public getIps (): Promise<iIp[]> {

        return fetch("/api/ips").then((content: Response): Promise<iIp[]> => {

            return content.json();

        });

    }

    public getRaces (): Promise<iRace[]> {

        return fetch("/api/races").then((content: Response): Promise<iRace[]> => {

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
