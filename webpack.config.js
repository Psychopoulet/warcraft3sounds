// deps

	// natives
	const { join } = require("path");

// consts

    const PUBLIC = join(__dirname, "public");

// module

module.exports = {

  "mode": "development",

  "entry": join(PUBLIC, "src", "index.tsx"),
  "output": {
    "filename": "bundle.js",
    "path": PUBLIC
  },

  "module": {
    "rules": [
      {
        "test": /\.tsx?$/,
        "use": [
            {
                "loader": "ts-loader",
                "options": {
                    "configFile": "tsconfig-front.json"
                }
            }
        ],
        "exclude": /node_modules/
      }
    ]
  },

  "devtool": "inline-source-map",
  "resolve": {
    "extensions": [ ".tsx", ".ts", ".js" ],
  }

};
