# warcraft3sounds
A basic API for Warcraft 3 sounds

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/warcraft3sounds.svg)](https://github.com/Psychopoulet/warcraft3sounds/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/warcraft3sounds.svg)](https://github.com/Psychopoulet/warcraft3sounds/pulls)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_warcraft3sounds&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_warcraft3sounds)

[![Known Vulnerabilities](https://snyk.io/test/github/Psychopoulet/warcraft3sounds/badge.svg)](https://snyk.io/test/github/Psychopoulet/warcraft3sounds)

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

### Thanks

- Special thanks to https://wowwiki.fandom.com/ for a lot of specific sentences (in an in-game language)
- Thanks for https://classic.battle.net for the pictures used in the front interface
