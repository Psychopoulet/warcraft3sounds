# warcraft3sounds
A basic API for Warcraft 3 sounds

[![Build Status](https://api.travis-ci.org/Psychopoulet/warcraft3sounds.svg?branch=develop)](https://travis-ci.org/Psychopoulet/warcraft3sounds)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/warcraft3sounds/badge.svg?branch=develop)](https://coveralls.io/github/Psychopoulet/warcraft3sounds)
[![Dependency Status](https://img.shields.io/david/Psychopoulet/warcraft3sounds/develop.svg)](https://github.com/Psychopoulet/warcraft3sounds)

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
$ npm start
```

Check the default basic interface http://localhost:3000

### With specific port

In the "warcraft3sounds" folder, execute

```bash
$ node lib/main.js [port]
```

Check the basic interface http://localhost: [port]
