import type { components } from "../descriptor";
type iActionData = components["schemas"]["BasicFileData"] & {
    "type": components["schemas"]["BasicData"];
};
export type iCharacter = components["schemas"]["BasicDataWithUrl"] & {
    "actions": iActionData[];
};
export default class WarcraftSoundsModel {
    private _db;
    constructor();
    init(): Promise<void>;
    release(): Promise<void>;
    getIps(): Promise<components["schemas"]["IP"][]>;
    getRaces(): Promise<components["schemas"]["BasicDataWithUrl"][]>;
    getRace(code: string): Promise<components["schemas"]["Race"] | null>;
    getCharacter(codeRace: string, code: string, notWorded?: boolean): Promise<iCharacter | null>;
}
export {};
