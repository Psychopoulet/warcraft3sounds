/* eslint-disable n/no-process-env */
// n/no-process-env : let the logger choose the file or the console from NODE_ENV

// deps

    // natives
    import { mkdir } from "node:fs/promises";
    import { homedir } from "node:os";
    import { join } from "node:path";

    // externals
    import winston from "winston";
    import DailyRotateFile from "winston-daily-rotate-file";

// types & interfaces

    export interface iLogger {
        "critical": (content: string) => void,
        "error": (content: string) => void,
        "warning": (content: string) => void,
        "success": (content: string) => void,
        "info": (content: string) => void,
        "debug": (content: string) => void,
        "close": () => Promise<void>
    }

// consts

    const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";

    let _logger: iLogger | null = null;
    let _pending: Promise<iLogger> | null = null;

// module

    export function getLogsDirectory (): string {

        return join(homedir(), "warcraft3sounds", "logs");

    }

    function _bind (logger: winston.Logger, level: string): (content: string) => void {

        return (content: string): void => {
            logger.log(level, content);
        };

    }

    function _close (logger: winston.Logger): () => Promise<void> {

        let closing: Promise<void> | null = null;

        // safe to call several times : every call shares the same promise
        return (): Promise<void> => {

            closing ??= new Promise((resolve: () => void): void => {

                if (logger.writableFinished) {
                    resolve();
                    return;
                }

                // "finish" : every pending log has been written to the transports
                logger.once("finish", resolve);
                logger.end();

            });

            return closing;

        };

    }

    function _toLogger (logger: winston.Logger): iLogger {

        return {
            "critical": _bind(logger, "critical"),
            "error": _bind(logger, "error"),
            "warning": _bind(logger, "warning"),
            "success": _bind(logger, "success"),
            "info": _bind(logger, "info"),
            "debug": _bind(logger, "debug"),
            "close": _close(logger)
        };

    }

    async function _fileTransport (): Promise<DailyRotateFile> {

        const logsDirectory: string = getLogsDirectory();

        await mkdir(logsDirectory, {
            "recursive": true
        });

        return new DailyRotateFile({
            "level": "info",
            "dirname": logsDirectory,
            "filename": "%DATE%.log",
            "datePattern": "YYYY-MM-DD",
            "maxFiles": "10d",
            "auditFile": join(logsDirectory, ".audit.json"),
            "format": winston.format.combine(
                winston.format.timestamp({
                    "format": TIMESTAMP_FORMAT
                }),
                winston.format.json()
            )
        });

    }

    function _consoleTransport (): winston.transport {

        return new winston.transports.Console({
            "level": "debug",
            "format": winston.format.combine(
                winston.format.timestamp({
                    "format": TIMESTAMP_FORMAT
                }),
                winston.format.colorize({
                    "level": true
                }),
                winston.format.printf(({ level, message, timestamp }): string => {
                    return String(timestamp) + " " + String(level) + ": " + String(message);
                })
            )
        });

    }

    async function _createLogger (): Promise<iLogger> {

        winston.addColors({
            "critical": "bold red",
            "error": "red",
            "warning": "yellow",
            "success": "green",
            "info": "blue",
            "debug": "grey"
        });

        const transport: winston.transport = "production" === process.env.NODE_ENV ? await _fileTransport() : _consoleTransport();

        const logger: winston.Logger = winston.createLogger({
            "levels": {
                "critical": 0,
                "error": 1,
                "warning": 2,
                "success": 3,
                "info": 4,
                "debug": 5
            },
            "transports": [ transport ]
        });

        return _toLogger(logger);

    }

export function initLogger (): Promise<iLogger> {

    _pending ??= _createLogger().then((created: iLogger): iLogger => {

        // once closed, the ended stream must not be reachable anymore : getLogger() throws again
        const logger: iLogger = {
            ...created,
            "close": (): Promise<void> => {

                return created.close().then((): void => {

                    _logger = null;
                    _pending = null;

                });

            }
        };

        _logger = logger;

        return logger;

    });

    return _pending;

}

export default function getLogger (): iLogger {

    if (null === _logger) {
        throw new Error("Logger is not initialized");
    }

    return _logger;

}
