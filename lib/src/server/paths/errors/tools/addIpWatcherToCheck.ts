// deps

    // locals
    import addToCheckFile from "./addToCheckFile";

// consts

    const FILENAME = "watchers-ips-to-check.txt";

// module

export default function addIpWatcherToCheck (ip: string): Promise<void> {
    return addToCheckFile(FILENAME, ip);
}
