
-- races

CREATE TABLE races (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code VARCHAR(20) NOT NULL,
	name VARCHAR(25) NOT NULL,
	icon VARCHAR(100) NOT NULL,
	UNIQUE (code)
);

-- actions_types

CREATE TABLE actions_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(25) NOT NULL,
  UNIQUE (code)
);

-- musics

CREATE TABLE musics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  UNIQUE (k_race, code),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- warnings

CREATE TABLE warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  UNIQUE (k_race, code),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- characters

CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
	icon VARCHAR(100) NOT NULL,
  hero tinyint(1) NOT NULL DEFAULT 0,
  tft tinyint(1) NOT NULL DEFAULT 0,
  UNIQUE (k_race, code),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- actions

CREATE TABLE actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_character INTEGER NOT NULL,
  k_action_type INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  UNIQUE (k_character, k_action_type, code),
  FOREIGN KEY (k_character) REFERENCES characters (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (k_action_type) REFERENCES actions_types (id) ON DELETE CASCADE ON UPDATE CASCADE
);
