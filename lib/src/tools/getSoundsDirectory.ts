// deps

    // natives
    import { homedir } from "node:os";
    import { join } from "node:path";

// module

export default function getSoundsDirectory (): string {
    return join(homedir(), "warcraft3sounds", "sounds");
}
