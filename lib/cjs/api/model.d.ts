import type { components } from "../descriptor";
type iBasicDataWithUrl = components["schemas"]["BasicData"] & {
    "url": string;
};
interface iBasicFileData extends iBasicDataWithUrl {
    "file": string;
}
type iActionData = iBasicFileData & {
    "type": components["schemas"]["BasicData"];
};
export interface iIp {
    "address": string;
    "name": string;
}
export interface iRace extends iBasicDataWithUrl {
    "characters": iBasicDataWithUrl[];
    "musics": iBasicFileData[];
    "warnings": iBasicFileData[];
}
export interface iCharacter extends iBasicDataWithUrl {
    "actions": iActionData[];
}
export default class WarcraftSoundsModel {
    private _db;
    constructor();
    init(): Promise<void>;
    release(): Promise<void>;
    getIps(): Promise<iIp[]>;
    getRaces(): Promise<iBasicDataWithUrl[]>;
    getRace(code: string): Promise<iRace | null>;
    getCharacter(codeRace: string, code: string, notWorded?: boolean): Promise<iCharacter | null>;
}
export {};
