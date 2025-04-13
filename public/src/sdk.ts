"use strict";

// types & interfaces

    // locals
    import type { iBasicDataWithUrl, iIp, iRace, iCharacter } from "../../lib/src/api/model";
    export type { iBasicDataWithUrl, iIp, iRace, iCharacter };

// component

export class SDK {

    public getIps (): Promise<iIp[]> {

        return fetch("/api/ips").then((content: Response): Promise<iIp[]> => {

            return content.json();

        });

    }

    public getRaces (): Promise<iBasicDataWithUrl[]> {

        return fetch("/api/races").then((content: Response): Promise<iBasicDataWithUrl[]> => {

            return content.json();

        });

    }

    public getRace (raceCode: iRace["code"]): Promise<iRace> {

        return fetch("/api/races/" + raceCode).then((content: Response): Promise<iRace> => {

            return content.json();

        });

    }

    public getCharacter (raceCode: iRace["code"], characterCode: iCharacter["code"]): Promise<iCharacter> {

        return fetch("/api/races/" + raceCode + "/characters/" + characterCode).then((content: Response): Promise<iCharacter> => {

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
