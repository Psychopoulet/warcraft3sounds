# warcraft3sounds
A basic API for Warcraft 3 sounds

[![Build status](https://api.travis-ci.org/Psychopoulet/warcraft3sounds.svg?branch=master)](https://travis-ci.org/Psychopoulet/warcraft3sounds)
[![Coverage status](https://coveralls.io/repos/github/Psychopoulet/warcraft3sounds/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/warcraft3sounds)
[![Dependency status](https://david-dm.org/Psychopoulet/warcraft3sounds/status.svg)](https://david-dm.org/Psychopoulet/warcraft3sounds)
[![Dev dependency status](https://david-dm.org/Psychopoulet/warcraft3sounds/dev-status.svg)](https://david-dm.org/Psychopoulet/warcraft3sounds?type=dev)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/warcraft3sounds.svg)](https://github.com/Psychopoulet/warcraft3sounds/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/warcraft3sounds.svg)](https://github.com/Psychopoulet/warcraft3sounds/pulls)

## Download

### NodeJS

- Debian based on (ubuntu, etc...) :

```bash
$ sudo apt-get install nodejs
```

- Others :

Download it [here](https://nodejs.org/en/)

### Git

- Debian based on (ubuntu, etc...) :

```bash
$ sudo apt-get install git-all
```

- Others :

Download it [here](https://git-scm.com/downloads)

### WarcraftSounds

Go to your targeted folder (like "/etc/" or "C:\Users\[user]\Documents") and execute

```bash
$ git clone https://github.com/Psychopoulet/warcraft3sounds --recursive
```

### Dependencies

In the "warcraft3sounds" downloaded folder, execute

```bash
$ npm install --prod
```

> You may need to compile the sqlite3 package, if you have an error, please check [that](https://www.npmjs.com/package/node-gyp)

## Extract sounds

You have a lot of documentation to extract Warcraft 3's sounds on the web.

[Check here](https://www.google.fr/search?q=extract+warcraft3+sounds) to see that.

Once you have the sounds, put it all in the same folder, here "warcraft3sounds/lib/public/sounds"

## Run

### Default configuration

In the "warcraft3sounds" folder, execute

```bash
$ npm run start
```

Check the default basic interface http://localhost:3000

### With specific port | ssl activated

In the "warcraft3sounds" folder, execute

```bash
$ npm run start -- [--port <port>] [--ssl]
```

Check the basic interface on http[s]://localhost [:port]
