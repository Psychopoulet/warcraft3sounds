// deps

    // natives
    import { homedir } from "node:os";
    import { join } from "node:path";

// consts

    let _soundsDirectory: string | null = null;

// module

export function setSoundsDirectory (dir: string | null): void {

    _soundsDirectory = dir;

}

export default function getSoundsDirectory (): string {

    return _soundsDirectory ?? join(homedir(), "warcraft3sounds", "sounds");

}
