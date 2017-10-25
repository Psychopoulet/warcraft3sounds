
CREATE TABLE musics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  filehash varchar(40) NOT NULL,
  UNIQUE (k_race, code),
  UNIQUE (filehash),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  filehash varchar(40) NOT NULL,
  UNIQUE (k_race, code),
  UNIQUE (filehash),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_character INTEGER NOT NULL,
  k_action_type INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  file varchar(50) NOT NULL,
  filehash varchar(40) NOT NULL,
  UNIQUE (k_character, k_action_type, code),
  UNIQUE (filehash),
  FOREIGN KEY (k_character) REFERENCES characters (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (k_action_type) REFERENCES actions_types (id) ON DELETE CASCADE ON UPDATE CASCADE
);
