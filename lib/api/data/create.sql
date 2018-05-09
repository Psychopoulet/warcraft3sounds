
-- races

CREATE TABLE races (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code VARCHAR(20) NOT NULL,
	name VARCHAR(25) NOT NULL,
	UNIQUE (code)
);

INSERT INTO races (id, code, name) VALUES
(1, 'humans', 'Humains'),
(2, 'nightelfs', 'Elfes de la nuit'),
(3, 'orcs', 'Orcs'),
(4, 'undeads', 'Morts vivants'),
(5, 'neutrals', 'Neutres');

-- actions_types

CREATE TABLE actions_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(25) NOT NULL,
  UNIQUE (code)
);

INSERT INTO actions_types (id, code, name) VALUES
(1, 'ready', 'Prêt !'),
(2, 'warcry', 'Cri de guerre'),
(3, 'what', 'Quoi ?'),
(4, 'yes', 'Oui ?'),
(5, 'attack', 'Attaque'),
(6, 'fun', 'Fun'),
(7, 'death', 'Mort');

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

INSERT INTO musics (k_race, code, name, file) VALUES

(1, 'theme1', 'Thème 1', 'Human1.mp3'),
(1, 'theme2', 'Thème 2', 'Human2.mp3'),
(1, 'theme3', 'Thème 3', 'Human3.mp3'),
(1, 'defeat', 'Défaite', 'HumanDefeat.mp3'),
(1, 'victory', 'Victoire', 'HumanVictory.mp3'),

(2, 'theme1', 'Thème 1', 'NightElf1.mp3'),
(2, 'theme2', 'Thème 2', 'NightElf2.mp3'),
(2, 'theme3', 'Thème 3', 'NightElf3.mp3'),
(2, 'defeat', 'Défaite', 'NightElfDefeat.mp3'),
(2, 'victory', 'Victoire', 'NightElfVictory.mp3'),

(3, 'theme1', 'Thème 1', 'Orc1.mp3'),
(3, 'theme2', 'Thème 2', 'Orc2.mp3'),
(3, 'theme3', 'Thème 3', 'Orc3.mp3'),
(3, 'defeat', 'Défaite', 'OrcDefeat.mp3'),
(3, 'victory', 'Victoire', 'OrcVictory.mp3'),

(4, 'theme1', 'Thème 1', 'Undead1.mp3'),
(4, 'theme2', 'Thème 2', 'Undead2.mp3'),
(4, 'theme3', 'Thème 3', 'Undead3.mp3'),
(4, 'defeat', 'Défaite', 'UndeadDefeat.mp3'),
(4, 'victory', 'Victoire', 'UndeadVictory.mp3');

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

INSERT INTO warnings (k_race, code, name, file) VALUES

(1, 'allyattack', 'Notre allié est attaqué !', 'KnightAllyAttack1.wav'),
(1, 'allyherodies', 'Le héro de notre allié est tombé', 'KnightAllyHeroDies1.wav'),
(1, 'allytownattack', 'La ville de notre allié est assiégée', 'KnightAllyTownAttack1.wav'),
(1, 'buildingcomplete', 'Travail terminé', 'PeasantBuildingComplete1.wav'),
(1, 'cannotbuildthere', 'Je ne peux rien bâtir ici', 'PeasantCannotBuildThere1.wav'),
(1, 'goldminecollapsed', 'Notre mine d''or s''est effondrée', 'KnightGoldMineCollapsed1.wav'),
(1, 'goldminelow', 'Notre mine d''or est presque épuisée', 'KnightGoldMineLow1.wav'),
(1, 'herodies', 'Notre héro est mort', 'KnightHeroDies1.wav'),
(1, 'inventoryfull', 'Inventaire plein', 'KnightInventoryFull1.wav'),
(1, 'noenergy', 'Mana insuffisant', 'KnightNoEnergy1.wav'),
(1, 'nofood', 'Il faut plus de fermes', 'KnightNoFood1.wav'),
(1, 'nogold', 'Nous avons besoin de plus d''or', 'KnightNoGold1.wav'),
(1, 'nolumber', 'Il nous faut plus de bois', 'KnightNoLumber1.wav'),
(1, 'researchcomplete', 'Recherche terminée', 'KnightResearchComplete1.wav'),
(1, 'townattack', 'Notre ville est assiégée', 'KnightTownAttack1.wav'),
(1, 'unitattack', 'Nous sommes attaqués', 'KnightUnitAttack1.wav'),
(1, 'upgradecomplete', 'Amélioration terminée', 'KnightUpgradeComplete1.wav'),

(2, 'allyattack', 'Nous devons aider nos alliés !', 'SentinelAllyUnderAttack1.wav'),
(2, 'allyherodies', 'Un champion allié est tombé !', 'SentinelAllyHeroDies1.wav'),
(2, 'allytownattack', 'La ville de notre allié a besoin de nous !', 'SentinelAllyTownAttack1.wav'),
(2, 'buildingcomplete', 'Bâtiment construit.', 'HuntressBuildingComplete1.wav'),
(2, 'cannotbuildthere', 'Impossible de construire ici.', 'HuntressCannotBuildThere1.wav'),
(2, 'goldminecollapsed', 'Notre mine d''or s''est effondrée', 'HuntressGoldMineCollapsed1.wav'),
(2, 'goldminelow', 'Notre mine d''or est presque épuisée', 'HuntressGoldMineLow1.wav'),
(2, 'herodies', 'Notre champion est mort', 'SentinelHeroDies1.wav'),
(2, 'inventoryfull', 'Inventaire plein', 'SentinelInventoryFull1.wav'),
(2, 'noenergy', 'Plus de mana', 'SentinelNoEnergy1.wav'),
(2, 'nofood', 'Construisez plus de puits de lune', 'HuntressNoFood1.wav'),
(2, 'nogold', 'Pas assez d''or', 'SentinelNoGold1.wav'),
(2, 'nolumber', 'Pas assez de bois', 'SentinelNoLumber1.wav'),
(2, 'researchcomplete', 'Recherche terminée', 'SentinelResearchComplete1.wav'),
(2, 'townattack', 'Ils souillent notre sanctuaire !', 'SentinelTownAttack1.wav'),
(2, 'unitattack', 'Nos guerriers engagent l''ennemi', 'SentinelUnitAttack1.wav'),
(2, 'upgradecomplete', 'Amélioration terminée', 'SentinelUpgradeComplete1.wav'),

(3, 'allyattack', 'Notre allié a besoin de nous', 'GruntAllyUnderAttack1.wav'),
(3, 'allyherodies', 'Le héros de notre allié est mort', 'GruntAllyHeroDies1.wav'),
(3, 'allytownattack', 'La ville de notre allié est attaquée !', 'GruntAllyTownAttack1.wav'),
(3, 'buildingcomplete', 'Travail terminé', 'PeonJobDone.wav'),
(3, 'cannotbuildthere', 'Impossible de construire ici', 'PeonCannotBuildThere1.wav'),
(3, 'goldminecollapsed', 'Notre mine d''or s''est effondrée', 'GruntGoldMineCollapsed1.wav'),
(3, 'goldminelow', 'Notre mine d''or est presque épuisée', 'GruntGoldMineLow1.wav'),
(3, 'herodies', 'Notre héros a été vaincu', 'GruntHeroDies1.wav'),
(3, 'inventoryfull', 'Inventaire plein', 'GruntInventoryFull1.wav'),
(3, 'noenergy', 'Pas assez de mana', 'GruntNoEnergy1.wav'),
(3, 'nofood', 'Construisez d''autres antre des orcs', 'GruntNoFood1.wav'),
(3, 'nogold', 'Il faut plus d''or', 'GruntNoGold1.wav'),
(3, 'nolumber', 'Il faut plus de bois', 'GruntNoLumber1.wav'),
(3, 'researchcomplete', 'Recherche terminée', 'GruntResearchComplete1.wav'),
(3, 'townattack', 'Notre ville est attaquée !', 'GruntTownAttack1.wav'),
(3, 'unitattack', 'Nous sommes attaqués !', 'GruntUnitAttack1.wav'),
(3, 'upgradecomplete', 'Amélioration terminée', 'GruntUpgradeComplete1.wav'),

(4, 'allyattack', 'Nos frères ont besoin d''aide', 'NecromancerAllyUnderAttack1.wav'),
(4, 'allyherodies', 'Un héro allié a succombé', 'NecromancerAllyHeroDies1.wav'),
(4, 'allytownattack', 'La ville de nos frères est attaquée', 'NecromancerAllyTownAttack1.wav'),
(4, 'buildingcomplete', 'L''invocation est accomplie', 'AcolyteBuildingComplete1.wav'),
(4, 'cannotbuildthere', 'Je ne peux pas invoquer ici', 'AcolyteCannotBuildThere1.wav'),
(4, 'goldminecollapsed', 'Notre mine d''or s''est effondrée', 'NecromancerGoldMineCollapsed1.wav'),
(4, 'goldminelow', 'Notre mine d''or est presque vide', 'NecromancerGoldMineNearlyEmpty1.wav'),
(4, 'herodies', 'Notre héro a succombé', 'NecromancerHeroDies1.wav'),
(4, 'inventoryfull', 'Inventaire plein', 'NecromancerInventoryFull1.wav'),
(4, 'noenergy', 'Pas assez de mana', 'NecromancerNoEnergy1.wav'),
(4, 'nofood', 'Dressez plus de ziggourat', 'NecromancerNoFood1.wav'),
(4, 'nogold', 'Il faut plus d''or', 'NecromancerNoGold1.wav'),
(4, 'nolumber', 'Il faut plus de bois', 'NecromancerNoLumber1.wav'),
(4, 'placedoffblight', 'On ne peut invoquer que sur terre hantée', 'AcolytePlacedOffBlight1.wav'),
(4, 'researchcomplete', 'Recherche terminée', 'NecromancerResearchComplete1.wav'),
(4, 'townattack', 'Des infidèles attaquent notre ville !', 'NecromancerTownAttack1.wav'),
(4, 'unitattack', 'Nos forces sont attaquées !', 'NecromancerUnitAttack1.wav'),
(4, 'upgradecomplete', 'Amélioration terminée', 'NecromancerUpgradeComplete1.wav'),

(5, 'goldminecollapsed', 'Une mine d''or s''est effondrée', 'GenericWarningGoldCollapsed1.mp3'),
(5, 'goldminelow', 'Une mine d''or est presque épuisée', 'GenericWarningGoldMineRunningLow1.mp3'),
(5, 'herodies', 'Un héro est mort', 'GenericWarningHeroFallen1.mp3'),
(5, 'noenergy', 'Pas assez de mana', 'GenericWarningNoMana1.mp3'),
(5, 'researchcomplete', 'La recherche est terminée', 'GenericWarningResearchComplete1.mp3'),
(5, 'townattack', 'Une ville est assiégée', 'GenericWarningTownAttack1.mp3'),
(5, 'unitattack', 'Les forces d''un joueur sont attaquées', 'GenericWarningUnitAttack1.mp3'),
(5, 'upgradecomplete', 'Amélioration terminée', 'GenericWarningUpgradeComplete1.mp3');

-- characters

CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  k_race INTEGER NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(25) NOT NULL,
  tft tinyint(1) NOT NULL DEFAULT 0,
  UNIQUE (k_race, code),
  FOREIGN KEY (k_race) REFERENCES races (id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO characters (id, k_race, code, name, tft) VALUES

-- humans

(1, 1, 'paladin', 'Paladin', 0),
(2, 1, 'mountainking', 'Roi de la montagne', 0),
(3, 1, 'archmage', 'Archimage', 0),
(4, 1, 'bloodelfmage', 'Mage elfe de sang', 1),
(5, 1, 'peasant', 'Paysan', 0),
(6, 1, 'footman', 'Soldat', 0),
(7, 1, 'rifleman', 'Fusiller', 0),
(8, 1, 'knight', 'Chevalier', 0),
(9, 1, 'gyrocopter', 'Gyrocoptère', 0),
(10, 1, 'gryphonrider', 'Chevaucheur de gryphon', 0),
(11, 1, 'priest', 'Prêtre', 0),
(12, 1, 'sorceress', 'Sorcière', 0),
(13, 1, 'spellbreaker', 'Briseur de sorts', 1),
(14, 1, 'hawkrider', 'Chevucheur de griffon', 1),
(15, 1, 'jaina', 'Jaina', 0),
(16, 1, 'mortarteam', 'Mortier', 0),
(17, 1, 'muradin', 'Muradin', 0),
(18, 1, 'uther', 'Uther', 0),
(19, 1, 'windserpent', 'windserpent', 0),
(20, 1, 'villager', 'Villageois', 0),
(21, 1, 'captain', 'Capitaine', 0),

-- nightelfs

(101, 2, 'demonhunter', 'Chasseur de démons', 0),
(102, 2, 'keeperofthegrove', 'Gardien du bosquet', 0),
(103, 2, 'moonpriestess', 'Prêtresse de la lune', 0),
(104, 2, 'warden', 'warden', 1),
(105, 2, 'archer', 'Archer', 0),
(106, 2, 'huntress', 'Chasseresse', 0),
(107, 2, 'dryad', 'Dryade', 0),
(108, 2, 'druidoftheclaw', 'Druide de la griffe', 0),
(109, 2, 'druidofthetalon', 'druidofthetalon', 0),
(110, 2, 'hippogryphrider', 'Chevaucheur d''hippogryphe', 0),
(111, 2, 'furion', 'Furion', 0),
(112, 2, 'illidan', 'Illidan', 0),
(113, 2, 'shandris', 'Shandris', 0),
(114, 2, 'sylvanas', 'Sylvanas', 0),
(115, 2, 'tyrande', 'Tyrande', 0),

-- orcs

(201, 3, 'blademaster', 'Maître d''arme', 0),
(202, 3, 'farseer', 'farseer', 0),
(203, 3, 'taurenchieftain', 'taurenchieftain', 0),
(204, 3, 'shadowhunter', 'shadowhunter', 1),
(205, 3, 'peon', 'Péon', 0),
(206, 3, 'grunt', 'Grunt', 0),
(207, 3, 'headhunter', 'headhunter', 0),
(208, 3, 'wolfrider', 'Chevaucheur de loup', 0),
(209, 3, 'wyvernrider', 'wyvernrider', 0),
(210, 3, 'tauren', 'Tauren', 0),
(211, 3, 'shaman', 'Shaman', 0),
(212, 3, 'witchdoctor', 'Docteur vaudou', 0),
(213, 3, 'spiritwalker', 'Esprit marcheur', 1),
(214, 3, 'cairne', 'Cairne', 0),
(215, 3, 'grom', 'Grom', 0),
(216, 3, 'thrall', 'Thrall', 0),
(217, 3, 'warlord', 'warlord', 0),

-- undeads

(301, 4, 'deathknight', 'Chevalier de la mort', 0),
(302, 4, 'lich', 'Liche', 0),
(303, 4, 'dreadlord', 'Seigneur de l''effroi', 0),
(304, 4, 'cryptlord', 'cryptlord', 1),
(305, 4, 'acolyte', 'Acolyte', 0),
(306, 4, 'ghoul', 'Goule', 0),
(307, 4, 'cryptfiend', 'Démon des cryptes', 0),
(308, 4, 'abomination', 'Abomination', 0),
(309, 4, 'necromancer', 'Nécromancien', 0),
(310, 4, 'banshee', 'Banshee', 0),
(311, 4, 'shade', 'Ombre', 0),
(312, 4, 'arthas', 'Arthas', 0),
(313, 4, 'kelthuzad', 'Kelthuzad', 0),
(314, 4, 'tichondrius', 'Tichondrius', 0),

-- neutrals

(401, 5, 'alchemist', 'Alchimiste', 1),
(402, 5, 'ladyvash', 'Lady Vash', 1),
(403, 5, 'tinker', 'Tinker', 1),
(404, 5, 'beastmaster', 'Maître des bêtes', 1),
(405, 5, 'pandaren', 'Pandaren', 1),
(406, 5, 'darkranger', 'darkranger', 1),
(407, 5, 'pitlord', 'Seigneur de la fosse', 0),
(408, 5, 'firelord', 'Seigneur du feu', 1),
(409, 5, 'bandit', 'Bandit', 0),
(410, 5, 'foresttroll', 'Troll des forêts', 0),
(411, 5, 'goblinmerchant', 'Marchant gobelin', 0),
(412, 5, 'goblinsapper', 'Sapeur gobelin', 0),
(413, 5, 'goblinzeppelin', 'Zeppelin', 0),
(414, 5, 'icetroll', 'Troll des glaces', 0),
(415, 5, 'ogre', 'Ogre', 0),
(416, 5, 'satyre', 'Satyre', 0);

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

-- humans

INSERT INTO actions (k_character, k_action_type, code, name, file) VALUES

(1, 1, 'ready1', 'Ma foi est mon glaive', 'HeroPaladinReady1.wav'),
(1, 2, 'warcry1', 'Que lightbringer te montre la voie', 'HeroPaladinWarcry1.wav'),
(1, 3, 'what1', 'Qu''attendez-vous de moi ?', 'HeroPaladinWhat1.wav'),
(1, 3, 'what2', 'Je n''ai aucune crainte', 'HeroPaladinWhat2.wav'),
(1, 3, 'what3', 'J''affronterai tous les périls', 'HeroPaladinWhat3.wav'),
(1, 3, 'what4', 'Comme il vous siéra', 'HeroPaladinWhat4.wav'),
(1, 4, 'yes1', 'Comme vous le souhaitez', 'HeroPaladinYes1.wav'),
(1, 4, 'yes2', 'Pour l''honneur', 'HeroPaladinYes2.wav'),
(1, 4, 'yes3', 'Pour la foi', 'HeroPaladinYes3.wav'),
(1, 4, 'yes4', 'Il en sera ainsi', 'HeroPaladinYes4.wav'),
(1, 5, 'attack1', 'Je suis le bras de la justice', 'HeroPaladinYesAttack1.wav'),
(1, 5, 'attack2', 'En votre nom', 'HeroPaladinYesAttack2.wav'),
(1, 5, 'attack3', 'Mort ! Aux infidèles', 'HeroPaladinYesAttack3.wav'),
(1, 6, 'fun1', 'Je sers la foi', 'HeroPaladinPissed1.wav'),
(1, 6, 'fun2', 'Je suis le bouclier des croyants', 'HeroPaladinPissed2.wav'),
(1, 6, 'fun3', 'Bas les pattes ! J''ai fait voeux de chasteté.', 'HeroPaladinPissed3.wav'),
(1, 6, 'fun4', 'Oui, Jean-Pierre... C''est mon dernier mot', 'HeroPaladinPissed4.wav'),
(1, 6, 'fun5', 'Je vais faire appel au public', 'HeroPaladinPissed5.wav'),
(1, 6, 'fun6', 'Le coté obscur n''est pas le plus fort, non. Plus rapide ! Plus facile. Plus séduisant...', 'HeroPaladinPissed6.wav'),
(1, 7, 'death1', 'Mort', 'HeroPaladinDeath.wav'),
(1, 7, 'death2', 'Fin du bouclier divin', 'PaladinDivineShieldDeath1.wav'),

(2, 1, 'ready1', 'Prêt !', 'HeroMountainKingReady1.wav'),
(2, 2, 'warcry1', 'Pour Khaz Modan !', 'HeroMountainKingWarcry1.wav'),
(2, 3, 'what1', 'Oui ?', 'HeroMountainKingWhat1.wav'),
(2, 3, 'what2', 'Vivement un peu d''action', 'HeroMountainKingWhat2.wav'),
(2, 3, 'what3', 'J''attend les ordres !', 'HeroMountainKingWhat3.wav'),
(2, 3, 'what4', 'Mmm ?', 'HeroMountainKingWhat4.wav'),
(2, 4, 'yes1', 'Très bien !', 'HeroMountainKingYes1.wav'),
(2, 4, 'yes2', 'C''est parti !', 'HeroMountainKingYes2.wav'),
(2, 4, 'yes3', 'En route !', 'HeroMountainKingYes3.wav'),
(2, 4, 'yes4', 'Laissez-moi passer !', 'HeroMountainKingYes4.wav'),
(2, 5, 'attack1', 'Aux armes !', 'HeroMountainKingYesAttack1.wav'),
(2, 5, 'attack2', 'Ca va faire mal', 'HeroMountainKingYesAttack2.wav'),
(2, 5, 'attack3', 'Tranche, taille et cours !', 'HeroMountainKingYesAttack3.wav'),
(2, 5, 'attack4', 'A l''assaut !', 'HeroMountainKingYesAttack4.wav'),
(2, 6, 'fun1', 'Un pastis, sinon rien', 'HeroMountainKingPissed1.wav'),
(2, 6, 'fun2', 'Tavernier, à boire et à manger', 'HeroMountainKingPissed2.wav'),
(2, 6, 'fun3', 'Qui est gros ?', 'HeroMountainKingPissed3.wav'),
(2, 6, 'fun4', 'Petit mais costaud !', 'HeroMountainKingPissed4.wav'),
(2, 6, 'fun5', 'On pourrait pas en discuter autour d''une chopine ?', 'HeroMountainKingPissed5.wav'),
(2, 6, 'fun6', 'Un tonneau d''hydromel, ça use le gosier', 'HeroMountainKingPissed6.wav'),
(2, 6, 'fun7', 'Du rhum, des femmes, et d''la bière nom de Dieu !', 'HeroMountainKingPissed7.wav'),
(2, 7, 'death1', 'Mort', 'HeroMountainKingDeath.wav'),

(3, 1, 'ready1', 'J''espère pour vous que ça en vaut la peine', 'HeroArchmageReady1.wav'),
(3, 2, 'warcry1', 'Pour la gloire', 'HeroArchmageWarcry1.wav'),
(3, 3, 'what1', 'Ainsi vous réclamez mon aide', 'HeroArchmageWhat1.wav'),
(3, 3, 'what2', 'Qui a-t-il, encore ?', 'HeroArchmageWhat2.wav'),
(3, 3, 'what3', 'Je vous écoute', 'HeroArchmageWhat3.wav'),
(3, 3, 'what4', 'Alors ?', 'HeroArchmageWhat4.wav'),
(3, 4, 'yes1', 'J''ai hâte d''y être', 'HeroArchmageYes1.wav'),
(3, 4, 'yes2', 'Parfait !', 'HeroArchmageYes2.wav'),
(3, 4, 'yes3', 'Puisqu''il le faut', 'HeroArchmageYes3.wav'),
(3, 4, 'yes4', 'Fort bien', 'HeroArchmageYes4.wav'),
(3, 5, 'attack1', 'J''engage le combat', 'HeroArchmageYesAttack1.wav'),
(3, 5, 'attack2', 'Pour la gloire', 'HeroArchmageYesAttack2.wav'),
(3, 5, 'attack3', 'Nim flori...', 'HeroArchmageYesAttack3.wav'),
(3, 6, 'fun1', 'La seule chance qu''on a de gagner la guerre, c''est qu''en face ils soient aussi cons qu''ici.', 'HeroArchmagePissed1.wav'),
(3, 6, 'fun2', 'Vous avez lu Clausewitz ?', 'HeroArchmagePissed2.wav'),
(3, 6, 'fun3', 'Et Sun-Tzu vous l''avez lu ?', 'HeroArchmagePissed3.wav'),
(3, 6, 'fun4', 'Magie, magie, et vos idées n''ont pas de génie', 'HeroArchmagePissed4.wav'),
(3, 7, 'death1', 'Mort', 'HeroArchmageDeath.wav'),

(5, 1, 'ready1', 'Prêt à travailler !', 'PeasantReady1.wav'),
(5, 2, 'warcry1', 'Haaaaaa', 'PeasantWarcry1.wav'),
(5, 3, 'what1', 'Oui messire ?', 'PeasantWhat1.wav'),
(5, 3, 'what2', 'Qu''y a-t-il ?', 'PeasantWhat2.wav'),
(5, 3, 'what3', 'Encore du travail ?', 'PeasantWhat3.wav'),
(5, 3, 'what4', 'Pardon ?', 'PeasantWhat4.wav'),
(5, 4, 'yes1', 'Bien', 'PeasantYes1.wav'),
(5, 4, 'yes2', 'Oui monseigneur', 'PeasantYes2.wav'),
(5, 4, 'yes3', 'Très bien', 'PeasantYes3.wav'),
(5, 4, 'yes4', 'Je m''en charge', 'PeasantYes4.wav'),
(5, 5, 'attack1', 'Je peux essayer', 'PeasantYesAttack1.wav'),
(5, 5, 'attack2', 'Si vous le voulez vraiment', 'PeasantYesAttack2.wav'),
(5, 5, 'attack3', 'Vous n''avez personne d''autre ?', 'PeasantYesAttack3.wav'),
(5, 5, 'attack4', 'Ça y est, je suis mort...', 'PeasantYesAttack4.wav'),
(5, 6, 'fun1', 'Votre prénom, c''est François, c''est juste ?', 'PeasantPissed1.wav'),
(5, 6, 'fun2', 'Il est bon ! C''est un champion du monde !', 'PeasantPissed2.wav'),
(5, 6, 'fun3', 'Il pourrait me faire l''historique de la louche à travers les âges ?', 'PeasantPissed3.wav'),
(5, 6, 'fun4', 'Ne m''invitez jamais à diner, j''aurais toujours un doute.', 'PeasantPissed4.wav'),
(5, 6, 'fun5', 'il essaie de faire de l''humour ! Ecoutez ça, c''est pathétique.', 'PeasantPissed5.wav'),
(5, 7, 'death1', 'Mort', 'PeasantDeath.wav'),

(6, 1, 'ready1', 'Prêt à l''action', 'FootmanReady1.wav'),
(6, 2, 'warcry1', 'Pour Lordaeron !', 'FootmanWarcry1.wav'),
(6, 3, 'what1', 'Quels sont les ordres ?', 'FootmanWhat1.wav'),
(6, 3, 'what2', 'Que voulez-vous ?', 'FootmanWhat2.wav'),
(6, 3, 'what3', 'Oui monseigneur ?', 'FootmanWhat3.wav'),
(6, 3, 'what4', 'Donnez vos ordres !', 'FootmanWhat4.wav'),
(6, 4, 'yes1', 'Compris, monseigneur', 'FootmanYes1.wav'),
(6, 4, 'yes3', 'A vos ordres !', 'FootmanYes3.wav'),
(6, 4, 'yes2', 'J''y vais !', 'FootmanYes2.wav'),
(6, 4, 'yes4', 'Certainement !', 'FootmanYes4.wav'),
(6, 5, 'attack1', 'Laissez-les moi !', 'FootmanYesAttack1.wav'),
(6, 5, 'attack2', 'A l''attaque !', 'FootmanYesAttack2.wav'),
(6, 5, 'attack3', 'Aux armes !', 'FootmanYesAttack3.wav'),
(6, 6, 'fun1', 'Sortez couverts !', 'FootmanPissed1.wav'),
(6, 6, 'fun2', 'Avant l''heure c''est pas l''heure, après l''heure c''est plus l''heure.', 'FootmanPissed2.wav'),
(6, 6, 'fun3', 'Engagez-vous, rengagez-vous, qu''il disait Lothar.', 'FootmanPissed3.wav'),
(6, 6, 'fun4', 'Ce n''est qu''une égratignure', 'FootmanPissed4.wav'),
(6, 7, 'death1', 'Mort', 'FootmanDeath.wav'),

(7, 1, 'ready1', 'Armé, et paré !', 'RiflemanReady1.wav'),
(7, 2, 'warcry1', 'Pour Ironforge !', 'RiflemanWarcry1.wav'),
(7, 3, 'what1', 'Oui chef !', 'RiflemanWhat1.wav'),
(7, 3, 'what2', 'Ma cible ?', 'RiflemanWhat2.wav'),
(7, 3, 'what3', 'Quelle est ma cible ?', 'RiflemanWhat3.wav'),
(7, 3, 'what4', 'Que voulez-vous ?', 'RiflemanWhat4.wav'),
(7, 4, 'yes1', 'Ooookay !', 'RiflemanYes1.wav'),
(7, 4, 'yes2', 'J''m''en occupe !', 'RiflemanYes2.wav'),
(7, 4, 'yes3', 'C''est parti !', 'RiflemanYes3.wav'),
(7, 4, 'yes4', 'Oui ?', 'RiflemanYes4.wav'),
(7, 5, 'attack1', 'Feu !', 'RiflemanYesAttack1.wav'),
(7, 5, 'attack2', 'J''ai ma cible en mire !', 'RiflemanYesAttack2.wav'),
(7, 5, 'attack3', 'Et un pruneau bien chaud, un !', 'RiflemanYesAttack3.wav'),
(7, 5, 'attack4', 'Tirez, pour tuer !', 'RiflemanYesAttack4.wav'),
(7, 6, 'fun1', 'Dans ce monde, y''a deux types d''hommes : ceux qui sont armés, et ceux qui creusent.', 'RiflemanPissed1.wav'),
(7, 6, 'fun2', 'Toi, tu creuse', 'RiflemanPissed2.wav'),
(7, 6, 'fun3', 'Peut importe ou, quand et comment, mais quelqu''un doit payer.', 'RiflemanPissed3.wav'),
(7, 6, 'fun4', 'Adrienne !!', 'RiflemanPissed4.wav'),
(7, 6, 'fun5', 'Tu réfléchira avant de tout engluer un mec qui a un positroneur désintégrant. Hein ?', 'RiflemanPissed5.wav'),
(7, 6, 'fun6', 'Raccourci ton rayon', 'RiflemanPissed6.wav'),
(7, 6, 'fun7', 'Il faut pas croiser les effluves, c''est mal', 'RiflemanPissed7.wav'),
(7, 6, 'fun8', 'Partenaire particulier, cherche partenaire particulière', 'RiflemanPissed8.wav'),
(7, 7, 'death1', 'Mort', 'RiflemanDeath.wav'),

(8, 1, 'ready1', 'J''attend vos ordres', 'KnightReady1.wav'),
(8, 2, 'warcry1', 'Pour l''honneur, et la liberté !', 'KnightWarcry1.wav'),
(8, 3, 'what1', 'Sir ?', 'KnightWhat1.wav'),
(8, 3, 'what2', 'Votre honneur ?', 'KnightWhat2.wav'),
(8, 3, 'what3', 'Quels sont vos ordres ?', 'KnightWhat3.wav'),
(8, 3, 'what4', 'Oui, monseigneur ?', 'KnightWhat4.wav'),
(8, 4, 'yes1', 'Sur le champ !', 'KnightYes1.wav'),
(8, 4, 'yes2', 'Pour le roi !', 'KnightYes2.wav'),
(8, 4, 'yes3', 'Certainement', 'KnightYes3.wav'),
(8, 4, 'yes4', 'Je m''en charge', 'KnightYes4.wav'),
(8, 5, 'attack1', 'Pour le roi !', 'KnightYesAttack1.wav'),
(8, 5, 'attack2', 'Je vais le pourfendre !', 'KnightYesAttack2.wav'),
(8, 5, 'attack3', 'Jusqu''à la mort !', 'KnightYesAttack3.wav'),
(8, 6, 'fun1', 'Je suis l''homme qui tombe à pic', 'KnightPissed1.wav'),
(8, 6, 'fun2', 'Par le pouvoir du crâne ancestral !', 'KnightPissed2.wav'),
(8, 6, 'fun3', 'Ils sont fous, ces romains', 'KnightPissed3.wav'),
(8, 6, 'fun4', 'Les chaussettes de l''archiduchesse, sont-elles sêches, archi-sêches ?', 'KnightPissed4.wav'),
(8, 6, 'fun5', 'Je n''ai pas dit "ni"', 'KnightPissed5.wav'),
(8, 6, 'fun6', 'Un chasseur sachant chasser sans son chien est un bon chasseur.', 'KnightPissed6.wav'),
(8, 7, 'death1', 'Mort', 'KnightDeath.wav'),

(9, 1, 'ready1', 'Larguez les amarres', 'GyrocopterReady1.wav'),
(9, 2, 'warcry1', 'Vers l''infini, et au-delà !', 'GyrocopterWarcry1.wav'),
(9, 3, 'what1', 'Que puis-je pour vous ?', 'GyrocopterWhat1.wav'),
(9, 3, 'what2', 'Quel est le plan de vol ?', 'GyrocopterWhat2.wav'),
(9, 3, 'what3', 'Donnez-moi le cap', 'GyrocopterWhat3.wav'),
(9, 3, 'what4', 'Tous les systèmes, OK !', 'GyrocopterWhat4.wav'),
(9, 3, 'what5', 'Ah ! Encore vous ?', 'GyrocopterWhat5.wav'),
(9, 4, 'yes1', 'Roger', 'GyrocopterYes1.wav'),
(9, 4, 'yes2', 'Cap enregistré', 'GyrocopterYes2.wav'),
(9, 4, 'yes3', 'On approche du mur du son', 'GyrocopterYes3.wav'),
(9, 4, 'yes4', 'Quoi, là-bas ?', 'GyrocopterYes4.wav'),
(9, 4, 'yes5', 'Ils ne m''entendront pas venir !', 'GyrocopterYes5.wav'),
(9, 5, 'attack1', 'Bombe, larguée', 'GyrocopterYesAttack1.wav'),
(9, 5, 'attack2', 'Cible verrouillée', 'GyrocopterYesAttack2.wav'),
(9, 5, 'attack3', 'J''attaque la cible !', 'GyrocopterYesAttack3.wav'),
(9, 5, 'attack4', 'Ça va faire mal !', 'GyrocopterYesAttack4.wav'),
(9, 6, 'fun1', 'Rogue Leader, au rapport', 'GyrocopterPissed1.wav'),
(9, 6, 'fun2', 'Restez en ligne', 'GyrocopterPissed2.wav'),
(9, 6, 'fun3', 'Je ne peux pas, ça bouge trop', 'GyrocopterPissed3.wav'),
(9, 6, 'fun4', 'Il est dans la ventilation', 'GyrocopterPissed4.wav'),
(9, 6, 'fun5', 'S''il peut saigner, on peut le tuer', 'GyrocopterPissed5.wav'),
(9, 6, 'fun6', 'Je parle d''une certaine spiritualité, elle est faite de oui, de non', 'GyrocopterPissed6.wav'),
(9, 6, 'fun7', 'Y''a-t-il un pilote dans l''avion ?', 'GyrocopterPissed7.wav'),
(9, 6, 'fun8', 'Ils ne sont pas à l''attention de savoir qu''ils existent', 'GyrocopterPissed8.wav'),
(9, 7, 'death1', 'Mort', 'GyrocopterDeath1.wav'),

(10, 1, 'ready1', 'Je vis pour servir', 'GryphonRiderReady1.wav'),
(10, 2, 'warcry1', 'Pour Khaz Modan !', 'GryphonRiderWarcry1.wav'),
(10, 3, 'what1', 'Ma vie est entre vos mains', 'GryphonRiderWhat1.wav'),
(10, 3, 'what2', 'Oui, chef ?', 'GryphonRiderWhat2.wav'),
(10, 3, 'what3', 'Je suis votre nain', 'GryphonRiderWhat3.wav'),
(10, 3, 'what4', 'La fin justifie les moyens', 'GryphonRiderWhat4.wav'),
(10, 3, 'what5', 'Yep !', 'GryphonRiderWhat5.wav'),
(10, 4, 'yes1', 'Yep, comptez sur moi', 'GryphonRiderYes1.wav'),
(10, 4, 'yes2', 'C''est vous le patron !', 'GryphonRiderYes2.wav'),
(10, 4, 'yes3', 'Pas de problème !', 'GryphonRiderYes3.wav'),
(10, 4, 'yes4', 'Super', 'GryphonRiderYes4.wav'),
(10, 4, 'yes5', 'Vers les cieux !', 'GryphonRiderYes5.wav'),
(10, 5, 'attack1', 'La mort vient du ciel !', 'GryphonRiderYesAttack1.wav'),
(10, 5, 'attack2', 'Vers la victoire !', 'GryphonRiderYesAttack2.wav'),
(10, 5, 'attack3', 'Par la barbe de Muradin !', 'GryphonRiderYesAttack3.wav'),
(10, 6, 'fun1', 'Boire ou conduire, il faut choisir', 'GryphonRiderPissed1.wav'),
(10, 6, 'fun2', 'C''est pas la taille qui compte, c''est le tranchant', 'GryphonRiderPissed2.wav'),
(10, 6, 'fun3', 'Un p''tit clou ?', 'GryphonRiderPissed3.wav'),
(10, 6, 'fun4', 'Que la force soit avec toi, Luke.', 'GryphonRiderPissed4.wav'),
(10, 6, 'fun5', 'Un cavalier, qui surgit hors de la nuit... Part, à l''aventure au galop...', 'GryphonRiderPissed5.wav'),
(10, 7, 'death1', 'Mort', 'GryphonRiderDeath1.wav'),

(11, 1, 'ready1', 'Je viens purifier cette contrée', 'PriestReady1.wav'),
(11, 2, 'warcry1', 'Frappez-les tous !', 'PriestWarcry1.wav'),
(11, 3, 'what1', 'Quels sont vos maux ?', 'PriestWhat1.wav'),
(11, 3, 'what2', 'Oui, mon fils ?', 'PriestWhat2.wav'),
(11, 3, 'what3', 'Souhaitez-vous ma bénédiction ?', 'PriestWhat3.wav'),
(11, 3, 'what4', 'Y''a-t-il des blessés ?', 'PriestWhat4.wav'),
(11, 4, 'yes1', 'Je suis votre serviteur', 'PriestYes1.wav'),
(11, 4, 'yes2', 'Bien entendu', 'PriestYes2.wav'),
(11, 4, 'yes3', 'Comme il vous plaira', 'PriestYes3.wav'),
(11, 4, 'yes4', 'Sur le champ', 'PriestYes4.wav'),
(11, 5, 'attack1', 'Notre malédiction vous barrera la route !', 'PriestYesAttack1.wav'),
(11, 6, 'fun1', 'Y''a pas deux félés, dans Warcraft 3', 'PriestPissed1.wav'),
(11, 6, 'fun2', 'On se lève tous, pour la lumière', 'PriestPissed2.wav'),
(11, 6, 'fun3', 'Quand 900 ans comme moi tu auras, moins en forme tu seras', 'PriestPissed3.wav'),
(11, 6, 'fun4', 'Au secours, il y a un peck qui me menace, il a un gland dans la main', 'PriestPissed4.wav'),
(11, 6, 'fun5', 'Mais moi, les dingues, j''les soigne', 'PriestPissed5.wav'),
(11, 6, 'fun6', 'Aux quatre coins de Paris on va l''retrouver éparpiller par p''tits bouts façon puzzle', 'PriestPissed6.wav'),
(11, 7, 'death1', 'Mort', 'PriestDeath.wav'),

(12, 1, 'ready1', 'La magie est instable, ces jours-ci', 'SorceressReady1.wav'),
(12, 2, 'warcry1', 'Pour l''alliance !', 'SorceressWarcry1.wav'),
(12, 3, 'what1', 'Besoin d''aide, humain ?', 'SorceressWhat1.wav'),
(12, 3, 'what2', 'Que cela en vaille la peine...', 'SorceressWhat2.wav'),
(12, 3, 'what3', 'Que puis-je pour vous ?', 'SorceressWhat3.wav'),
(12, 3, 'what4', 'J''écoute', 'SorceressWhat4.wav'),
(12, 3, 'what5', 'Alors ?', 'SorceressWhat5.wav'),
(12, 4, 'yes1', 'Si vous insistez', 'SorceressYes1.wav'),
(12, 4, 'yes2', 'Quelle bonne idée !', 'SorceressYes2.wav'),
(12, 4, 'yes3', 'Il était temps !', 'SorceressYes3.wav'),
(12, 4, 'yes4', 'Encore aux elfes de faire le travail...', 'SorceressYes4.wav'),
(12, 5, 'attack1', 'Vos désirs sont mes ordres !', 'SorceressYesAttack1.wav'),
(12, 5, 'attack2', 'La victoire nous appartient !', 'SorceressYesAttack2.wav'),
(12, 5, 'attack3', 'Sur-le-champ !', 'SorceressYesAttack3.wav'),
(12, 6, 'fun1', 'Crois-tu qu''on vive éternellement ?', 'SorceressPissed1.wav'),
(12, 6, 'fun2', 'Plutôt embrasser un wookiee !', 'SorceressPissed2.wav'),
(12, 6, 'fun3', 'Parce que je le vaux bien', 'SorceressPissed3.wav'),
(12, 6, 'fun4', 'A l''heure du choix, chacun est libre', 'SorceressPissed4.wav'),
(12, 6, 'fun5', 'Ils engagent des nains, maintenant, dans les commandos ?', 'SorceressPissed5.wav'),
(12, 6, 'fun6', 'Vous êtes venus dans cette casserole ? Vous êtes plus courageux que je ne le pensais', 'SorceressPissed6.wav'),
(12, 7, 'death1', 'Mort', 'SorceressDeath.wav'),

(15, 2, 'warcry1', 'Pour Dalaran !', 'JainaWarcry1.wav'),
(15, 3, 'what1', 'Je peux aider ?', 'JainaWhat1.wav'),
(15, 3, 'what2', 'C''est étrange', 'JainaWhat2.wav'),
(15, 3, 'what3', 'Chut ! J''essaie de réfléchir !', 'JainaWhat3.wav'),
(15, 3, 'what4', 'Quel est votre plan ?', 'JainaWhat4.wav'),
(15, 4, 'yes1', 'Ça m''a l''air bien', 'JainaYes1.wav'),
(15, 4, 'yes2', 'Je vais voir', 'JainaYes2.wav'),
(15, 4, 'yes3', 'Ça parait intéressant', 'JainaYes3.wav'),
(15, 4, 'yes4', 'Je m''en charge', 'JainaYes4.wav'),
(15, 5, 'attack1', 'Je déteste avoir recours à la violence', 'JainaYesAttack1.wav'),
(15, 5, 'attack2', 'Vous l''avez cherché !', 'JainaYesAttack2.wav'),
(15, 6, 'fun1', 'Je ne suis pas un guerrier', 'JainaPissed1.wav'),
(15, 6, 'fun2', 'Je voulais étudier paisiblement !', 'JainaPissed2.wav'),
(15, 6, 'fun3', 'Il y a un grand trouble dans les courants magiques', 'JainaPissed3.wav'),
(15, 6, 'fun4', 'Je prie que mon père soit sain et sauf', 'JainaPissed4.wav'),
(15, 6, 'fun5', 'Les évènements commencent à être un peu bizarres', 'JainaPissed5.wav'),
(15, 7, 'death1', 'Mort', 'JainaOnFootDeath1.wav'),

(16, 1, 'ready1', 'Mortier, prêt !', 'MortarTeamReady1.wav'),
(16, 2, 'warcry1', 'Pour Khaz Modan !', 'MortarTeamWarcry1.wav'),
(16, 3, 'what1', 'Au combat !', 'MortarTeamWhat1.wav'),
(16, 3, 'what2', 'Où devons-nous aller ?', 'MortarTeamWhat2.wav'),
(16, 3, 'what3', 'Indiquez la cible', 'MortarTeamWhat3.wav'),
(16, 3, 'what4', 'Parés', 'MortarTeamWhat4.wav'),
(16, 4, 'yes1', 'J''y vais ! - Moi aussi', 'MortarTeamYes1.wav'),
(16, 4, 'yes2', 'On s''bouge !', 'MortarTeamYes2.wav'),
(16, 4, 'yes3', 'C''est l''bon choix ! - Bien d''accord', 'MortarTeamYes3.wav'),
(16, 4, 'yes4', 'Viens, p''tit gars ! -C''est parti !', 'MortarTeamYes4.wav'),
(16, 4, 'yes5', 'Vite fait, bien fait', 'MortarTeamYes5.wav'),
(16, 4, 'yes6', 'En route', 'MortarTeamYes6.wav'),
(16, 5, 'attack1', 'La bataille sera bientôt terminée', 'MortarTeamYesAttack1.wav'),
(16, 5, 'attack2', 'Vive les mortiers ! - Vive l''acier !', 'MortarTeamYesAttack2.wav'),
(16, 5, 'attack3', 'Ils sont morts, mais ils ne l''savent pas encore', 'MortarTeamYesAttack3.wav'),
(16, 5, 'attack4', 'Hey, toi ! Attrape !', 'MortarTeamYesAttack4.wav'),
(16, 5, 'attack5', 'Chaud devant', 'MortarTeamYesAttack5.wav'),
(16, 6, 'fun1', 'C''est toi et moi, mon gars. - Une belle synergie', 'MortarTeamPissed1.wav'),
(16, 6, 'fun2', 'Moi, c''est dynamite. - Moi, c''est TNT', 'MortarTeamPissed2.wav'),
(16, 6, 'fun3', 'Nous devons vaincre les nains ! - Heu, c''est nous les nains. - Ha...', 'MortarTeamPissed3.wav'),
(16, 6, 'fun4', 'J''ai huit secondes pour vous dire... - Que Warcraft 3, c''est de la dynamite', 'MortarTeamPissed4.wav'),
(16, 6, 'fun5', 'Et c''est comme ça qu''on fait les bébés nain ! - Haaa !', 'MortarTeamPissed5.wav'),
(16, 6, 'fun6', 'Passez n''importe quoi, mais fort !', 'MortarTeamPissed6.wav'),
(16, 6, 'fun7', 'Je suis l''agent spécial Johnson, et voici l''agent Johnson. - Aucune parenté', 'MortarTeamPissed7.wav'),
(16, 6, 'fun8', 'A trois, et on y va, ou à trois on y va ?', 'MortarTeamPissed8.wav'),
(16, 6, 'fun9', 'Servi chaud !', 'MortarTeamPissed9.wav'),
(16, 7, 'death1', 'Mort', 'MortarteamDeath.wav'),
(16, 7, 'death2', 'Mort alternative', 'MortarTeamDeathExplode.wav'),

(17, 2, 'warcry1', 'Force et honneur !', 'MuradinWarcry1.wav'),
(17, 3, 'what1', 'Que s''passe-t-il ?', 'MuradinWhat1.wav'),
(17, 3, 'what2', 'Je suis prêêêêt', 'MuradinWhat2.wav'),
(17, 3, 'what3', 'Vous êtes un peu lent, pour un humain, nan ?', 'MuradinWhat3.wav'),
(17, 3, 'what4', 'Allons-y !', 'MuradinWhat4.wav'),
(17, 4, 'yes1', 'Voilà qui est mieux !', 'MuradinYes1.wav'),
(17, 4, 'yes2', 'Qu''il en soit ainsi !', 'MuradinYes2.wav'),
(17, 4, 'yes3', 'C''est parti !', 'MuradinYes3.wav'),
(17, 4, 'yes4', 'Ça va chauffer !', 'MuradinYes4.wav'),
(17, 5, 'attack1', 'Pour Khaz Modan !', 'MuradinYesAttack1.wav'),
(17, 5, 'attack2', 'Par ma barbe !', 'MuradinYesAttack2.wav'),
(17, 5, 'attack3', 'Prend ça !', 'MuradinYesAttack3.wav'),
(17, 6, 'fun1', 'Mon frère aîné Magni, est le roi des nains !', 'MuradinPissed1.wav'),
(17, 6, 'fun2', 'Mon frère cadet Bran, est un grand explorateur !', 'MuradinPissed2.wav'),
(17, 6, 'fun3', 'Moi, je met des baffes', 'MuradinPissed3.wav'),
(17, 6, 'fun4', 'Des souris, et un nain', 'MuradinPissed4.wav'),
(17, 6, 'fun5', 'Continuez comme ça, et vous allez souffrir...', 'MuradinPissed5.wav'),
(17, 6, 'fun6', 'Il est interdit de lancer des nains...', 'MuradinPissed6.wav'),
(17, 6, 'fun8', 'Sors ton marteau, si t''es un nain !', 'MuradinPissed8.wav'),

(18, 2, 'warcry1', 'Pour le roi, Terenas', 'UtherWarcry1.wav'),
(18, 3, 'what1', 'Je suis ici', 'UtherWhat1.wav'),
(18, 3, 'what2', 'N''ayez crainte', 'UtherWhat2.wav'),
(18, 3, 'what3', 'La lumière nous guide', 'UtherWhat3.wav'),
(18, 3, 'what4', 'Nous ne faillirons pas', 'UtherWhat4.wav'),
(18, 4, 'yes1', 'Bien', 'UtherYes1.wav'),
(18, 4, 'yes2', 'Très sage', 'UtherYes2.wav'),
(18, 4, 'yes3', 'Pour la lumière', 'UtherYes3.wav'),
(18, 4, 'yes4', 'Par mon honneur', 'UtherYes4.wav'),
(18, 5, 'attack1', 'Pour Lordaeron !', 'UtherYesAttack1.wav'),
(18, 5, 'attack2', 'Pour la main d''argent !', 'UtherYesAttack2.wav'),
(18, 5, 'attack3', 'Que la lumière vous détruise !', 'UtherYesAttack3.wav'),
(18, 6, 'fun1', 'Je suis trop vieux pour tout ça', 'UtherPissed1.wav'),
(18, 6, 'fun2', 'Comme si les orcs ne suffisaient pas', 'UtherPissed2.wav'),
(18, 6, 'fun3', 'Il y a de la poussière sur mon auréole', 'UtherPissed3.wav'),
(18, 6, 'fun4', 'Mon église est mon champ de bataille', 'UtherPissed4.wav'),

(21, 2, 'warcry1', 'Pour le roi Térénas !', 'CaptainWarcry1.wav'),
(21, 3, 'what1', 'Je suis prêt.', 'CaptainWhat1.wav'),
(21, 3, 'what2', 'Que désirez-vous ?', 'CaptainWhat2.wav'),
(21, 3, 'what3', 'Comment puis-je vous servir ?', 'CaptainWhat3.wav'),
(21, 4, 'yes1', 'Je suis honoré.', 'CaptainYes1.wav'),
(21, 4, 'yes2', 'Je ferai de mon mieux.', 'CaptainYes2.wav'),
(21, 4, 'yes3', 'Pour Lordaeron !', 'CaptainYes3.wav'),
(21, 5, 'attack1', 'Bête immonde !', 'CaptainYesAttack1.wav'),
(21, 6, 'fun1', 'J''aurai dû écouter mon père, et devenir paysan...', 'CaptainPissed1.wav'),
(21, 6, 'fun2', 'Danger permanent, solde de misère...', 'CaptainPissed2.wav'),
(21, 6, 'fun3', 'Pose tes galons, qu''on s''explique entre hommes !', 'CaptainPissed3.wav');

-- nightelfs

INSERT INTO actions (k_character, k_action_type, code, name, file) VALUES

(105, 1, 'ready1', 'Je suis prête', 'ArcherReady1.wav'),
(105, 2, 'warcry1', 'A la lumière de la lune !', 'ArcherWarcry1.wav'),
(105, 3, 'what1', 'J''écoute.', 'ArcherWhat1.wav'),
(105, 3, 'what2', 'Indiquez le chemin.', 'ArcherWhat2.wav'),
(105, 3, 'what3', 'A vos ordres.', 'ArcherWhat3.wav'),
(105, 3, 'what4', 'Je vous écoute.', 'ArcherWhat4.wav'),
(105, 4, 'yes1', 'Bien compris.', 'ArcherYes1.wav'),
(105, 4, 'yes2', 'Reçu.', 'ArcherYes2.wav'),
(105, 4, 'yes3', 'Il en sera ainsi.', 'ArcherYes3.wav'),
(105, 4, 'yes4', 'Trop facile...', 'ArcherYes4.wav'),
(105, 5, 'attack1', 'Parée à décocher', 'ArcherYesAttack1.wav'),
(105, 5, 'attack2', 'Feu !', 'ArcherYesAttack2.wav'),
(105, 5, 'attack3', 'Une flèche, un mort', 'ArcherYesAttack3.wav'),
(105, 5, 'attack4', 'Mon arc est à vos ordres !', 'ArcherYesAttack4.wav'),
(105, 6, 'fun1', 'J''adore qu''un plan se déroule sans accroc', 'ArcherPissed1.wav'),
(105, 6, 'fun2', 'J''aurai les salauds qui ont fait ça !', 'ArcherPissed2.wav'),
(105, 6, 'fun3', 'Je prend aux riches pour donner aux pauvres.', 'ArcherPissed3.wav'),
(105, 6, 'fun4', 'Où est ma pomme ?', 'ArcherPissed4.wav'),
(105, 6, 'fun5', 'La vie c''est comme une boite de chocolats : on ne sait jamais sur quoi on va tomber.', 'ArcherPissed5.wav'),
(105, 6, 'fun6', 'La culture, c''est comme la confiture : moins on en a, plus on l''étale.', 'ArcherPissed6.wav'),
(105, 6, 'fun7', 'Secouez-moi, secouez-moi, sinon la pulpe, elle reste en bas.', 'ArcherPissed7.wav'),
(105, 6, 'fun8', 'Moi je dynamite ! Je disperse, je ventile...', 'ArcherPissed8.wav'),
(105, 7, 'death1', 'Mort', 'ArcherDeath1.wav'),

(106, 1, 'ready1', 'Déesse, montre-moi la voie...', 'HuntressReady1.wav'),
(106, 2, 'warcry1', 'Pour notre Mère !', 'HuntressWarcry1.wav'),
(106, 3, 'what1', 'Faites vite.', 'HuntressWhat1.wav'),
(106, 3, 'what2', 'En position...', 'HuntressWhat2.wav'),
(106, 3, 'what3', 'Je suis prète.', 'HuntressWhat3.wav'),
(106, 3, 'what4', 'Parlez...', 'HuntressWhat4.wav'),
(106, 3, 'what5', 'Je suis à vos ordres...', 'HuntressWhat5.wav'),
(106, 4, 'yes1', 'Absolument.', 'HuntressYes1.wav'),
(106, 4, 'yes2', 'Je ne crains rien.', 'HuntressYes2.wav'),
(106, 4, 'yes3', 'Comme le souhaite la déesse.', 'HuntressYes3.wav'),
(106, 4, 'yes4', 'Je me fond dans les ténèbres.', 'HuntressYes4.wav'),
(106, 4, 'yes5', 'Ma patience est récompensée.', 'HuntressYes5.wav'),
(106, 5, 'attack1', 'Cherche !', 'HuntressYesAttack1.wav'),
(106, 5, 'attack2', 'Trouve !', 'HuntressYesAttack2.wav'),
(106, 5, 'attack3', 'Craignez la nuit !', 'HuntressYesAttack3.wav'),
(106, 5, 'attack4', 'Faites vos prières...', 'HuntressYesAttack4.wav'),
(106, 5, 'attack5', 'Ils vont souffrir...', 'HuntressYesAttack5.wav'),
(106, 6, 'fun1', 'Il y a les bons chausseurs, et les mauvais chasseurs.', 'HuntressPissed1.wav'),
(106, 6, 'fun2', 'Chasseurs, chasseuses, on vous ment, on vous spolie !', 'HuntressPissed2.wav'),
(106, 6, 'fun3', 'Il y en a même qui m''appellent "madame" le chasseur.', 'HuntressPissed3.wav'),
(106, 6, 'fun4', 'La Chasseresse, Diane la Chasseresse.', 'HuntressPissed4.wav'),
(106, 6, 'fun5', 'Et ne me confondez pas avec Xena.', 'HuntressPissed5.wav'),
(106, 6, 'fun6', 'Vous avez reçu... 1... Email.', 'HuntressPissed6.wav'),
(106, 6, 'fun7', 'Vole, Bubo !', 'HuntressPissed7.wav'),
(106, 6, 'fun8', 'La voie du click est impénétrable.', 'HuntressPissed8.wav');

-- orcs

INSERT INTO actions (k_character, k_action_type, code, name, file) VALUES

(205, 1, 'ready1', 'Prêt à travailler', 'PeonReady1.wav'),
(205, 2, 'warcry1', 'Pourquoi pas ?', 'PeonWarcry1.wav'),
(205, 3, 'what1', 'Oui ?', 'PeonWhat1.wav'),
(205, 3, 'what2', 'Huu ?', 'PeonWhat2.wav'),
(205, 3, 'what3', 'Quoi ?', 'PeonWhat3.wav'),
(205, 3, 'what4', 'Que dois-je faire ?', 'PeonWhat4.wav'),
(205, 4, 'yes1', 'Je peux le faire !', 'PeonYes1.wav'),
(205, 4, 'yes2', 'Avec plaisir', 'PeonYes2.wav'),
(205, 4, 'yes3', 'Du travail, encore du travail...', 'PeonYes3.wav'),
(205, 4, 'yes4', 'Oki doki !', 'PeonYes4.wav'),
(205, 5, 'attack1', 'Okay !', 'PeonYesAttack1.wav'),
(205, 5, 'attack2', 'Tuez-les !', 'PeonYesAttack2.wav'),
(205, 5, 'attack3', 'J''vais essayer', 'PeonYesAttack3.wav'),
(205, 6, 'fun1', 'Quoiiii ?', 'PeonPissed1.wav'),
(205, 6, 'fun2', 'Occupé. Oubliez-moi !', 'PeonPissed2.wav'),
(205, 6, 'fun3', 'Je n''ai pas le temps de jouer !', 'PeonPissed3.wav'),
(205, 6, 'fun4', 'Je n''suis pas un gentil orc !', 'PeonPissed4.wav'),
(205, 7, 'death1', 'Mort', 'PeonDeath.wav');
