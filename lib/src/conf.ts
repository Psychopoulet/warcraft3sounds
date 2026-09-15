// deps

    // externals
    import ConfManager from "node-confmanager";

// module

let _conf: ConfManager | null = null;

export default function getConf (): ConfManager {

    if (null === _conf) {

        _conf = new ConfManager();

        _conf
            .skeleton("port", "integer")
            .document("port", "Port used by the server")

            .skeleton("ssl", "boolean")
            .document("ssl", "Is SSL activated ?")

            .skeleton("database-file", "string")
            .document("database-file", "Path to the database file");

    }

    return _conf;

}
