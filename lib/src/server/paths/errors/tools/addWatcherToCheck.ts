// deps

    // locals
    import addToCheckFile from "./addToCheckFile";

// consts

    const FILENAME = "watchers-paths-to-check.txt";

// module

export default function addWatcherToCheck (path: string): Promise<void> {
    return addToCheckFile(FILENAME, path);
}
