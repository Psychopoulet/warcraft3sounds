import type { components } from "../descriptor";
export default class WarcraftSoundsModel {
    private readonly _db;
    constructor();
    init(): Promise<void>;
    release(): Promise<void>;
    getIps(): Promise<Array<components["schemas"]["IP"]>>;
    getRaces(): Promise<Array<components["schemas"]["BasicRace"]>>;
    getRace(code: string): Promise<components["schemas"]["Race"] | null>;
    getCharacter(codeRace: string, code: string, notWorded?: boolean): Promise<components["schemas"]["Character"] | null>;
}
