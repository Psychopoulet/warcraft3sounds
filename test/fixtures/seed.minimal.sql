-- unit tests only (not loaded at runtime)
-- schema: lib/data/create.sql

INSERT INTO races (id, code, name, icon) VALUES
(1, 'humans', 'Humains', 'https://classic.battle.net/war3/images/human/humanseal.gif');

INSERT INTO actions_types (id, code, name) VALUES
(1, 'ready', 'Prêt !');

INSERT INTO musics (k_race, code, name, file) VALUES
(1, 'theme1', 'Thème 1', 'theme.mp3');

INSERT INTO warnings (k_race, code, name, file) VALUES
(1, 'townattack', 'Notre ville est assiégée', 'warning.wav');

INSERT INTO characters (id, k_race, code, name, icon, hero, tft) VALUES
(1, 1, 'peasant', 'Paysan', 'https://classic.battle.net/war3/images/human/units/portraits/peasant.gif', 0, 0);

INSERT INTO actions (k_character, k_action_type, code, name, file) VALUES
(1, 1, 'ready1', 'Prêt !', 'ready.wav');
