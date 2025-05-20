import type { components } from "../descriptor";
export default class WarcraftSoundsModel {
    private _db;
    constructor();
    init(): Promise<void>;
    release(): Promise<void>;
    getIps(): Promise<components["schemas"]["IP"][]>;
    getRaces(): Promise<components["schemas"]["BasicDataWithUrl"][]>;
    getRace(code: string): Promise<components["schemas"]["Race"] | null>;
    getCharacter(codeRace: string, code: string, notWorded?: boolean): Promise<components["schemas"]["Character"] | null>;
}
