interface iBasicData {
    "code": string;
    "name": string;
}
export interface iBasicDataWithUrl extends iBasicData {
    "url": string;
}
interface iBasicFileData extends iBasicDataWithUrl {
    "file": string;
}
interface iActionData extends iBasicFileData {
    "type": iBasicData;
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
    getRaces(): Promise<iBasicDataWithUrl[]>;
    getRace(code: string): Promise<iRace | null>;
    getCharacter(codeRace: string, code: string, notWorded?: boolean): Promise<iCharacter | null>;
}
export {};
