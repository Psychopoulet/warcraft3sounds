// deps

    // natives
    import { stat } from "node:fs";

// types & interfaces

    // natives
    import type { Stats } from "node:fs";

// module

export default function getfileStats (file: string): Promise<{
    "exists": boolean;
    "size": number;
}> {

    return new Promise((resolve: (stats: {
        "exists": boolean;
        "size": number;
    }) => void): void => {

        stat(file, (err: NodeJS.ErrnoException | null, stats: Stats): void => {

            if (err) {

                return resolve({
                    "exists": false,
                    "size": 0
                });

            }

            return resolve({
                "exists": !(err || !stats.isFile()),
                "size": stats.size
            });

        });

    });

}
