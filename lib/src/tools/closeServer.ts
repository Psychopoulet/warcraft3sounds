// types & interfaces

    // natives
    import type { Server } from "node:http";

// consts

    // ms to let running requests end before forcing connections to close (must stay below the app stop_grace_period, 20s)
    const SHUTDOWN_TIMEOUT = 8000;

// module

export default function closeServer (server: Server): Promise<void> {

    return new Promise((resolve: () => void, reject: (err: Error) => void): void => {

        // keep-alive connections would hold the shutdown : force them after the timeout
        const timer: NodeJS.Timeout = setTimeout((): void => {
            server.closeAllConnections();
        }, SHUTDOWN_TIMEOUT);

        // stop accepting new connections, resolves once the running requests are done
        server.close((err?: Error): void => {

            clearTimeout(timer);

            return err ? reject(err) : resolve();

        });

        server.closeIdleConnections();

    });

}
