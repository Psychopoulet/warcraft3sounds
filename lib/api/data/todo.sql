
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

-- actions

INSERT INTO actions (k_character, k_action_type, code, name, file) VALUES

(1052, 26, 5, 'attack1', '', 'orcs_actions_witchdoctor_attack_attack1.wav'),
(1053, 26, 5, 'attack2', '', 'orcs_actions_witchdoctor_attack_attack2.wav'),
(1055, 26, 5, 'attack3', '', 'orcs_actions_witchdoctor_attack_attack3.wav'),
(1056, 26, 6, 'fun2', '', 'orcs_actions_witchdoctor_fun_fun2.wav'),
(1057, 26, 7, 'death1', 'Mort', 'orcs_actions_witchdoctor_death_death1.wav'),
(1058, 26, 6, 'fun4', '', 'orcs_actions_witchdoctor_fun_fun4.wav'),
(1059, 26, 6, 'fun3', '', 'orcs_actions_witchdoctor_fun_fun3.wav'),
(1060, 26, 6, 'fun6', '', 'orcs_actions_witchdoctor_fun_fun6.wav'),
(1061, 26, 6, 'fun5', '', 'orcs_actions_witchdoctor_fun_fun5.wav'),
(1062, 26, 6, 'fun1', '', 'orcs_actions_witchdoctor_fun_fun1.wav'),
(1063, 26, 1, 'ready1', '', 'orcs_actions_witchdoctor_ready_ready1.wav'),
(1064, 26, 2, 'warcry1', '', 'orcs_actions_witchdoctor_warcry_warcry1.wav'),
(1065, 26, 3, 'what1', '', 'orcs_actions_witchdoctor_what_what1.wav'),
(1066, 26, 3, 'what2', '', 'orcs_actions_witchdoctor_what_what2.wav'),
(1067, 26, 3, 'what3', '', 'orcs_actions_witchdoctor_what_what3.wav'),
(1068, 26, 3, 'what4', '', 'orcs_actions_witchdoctor_what_what4.wav'),
(1069, 26, 4, 'yes2', '', 'orcs_actions_witchdoctor_yes_yes2.wav'),
(1070, 26, 4, 'yes1', '', 'orcs_actions_witchdoctor_yes_yes1.wav'),
(1071, 26, 6, 'fun7', '', 'orcs_actions_witchdoctor_fun_fun7.wav'),
(1074, 26, 4, 'yes3', '', 'orcs_actions_witchdoctor_yes_yes3.wav'),

(1072, 22, 5, 'attack1', '', 'orcs_actions_wolfrider_attack_attack1.wav'),
(1073, 22, 5, 'attack2', '', 'orcs_actions_wolfrider_attack_attack2.wav'),
(1075, 22, 5, 'attack3', '', 'orcs_actions_wolfrider_attack_attack3.wav'),
(1076, 22, 6, 'fun2', '', 'orcs_actions_wolfrider_fun_fun2.wav'),
(1077, 22, 6, 'fun1', '', 'orcs_actions_wolfrider_fun_fun1.wav'),
(1078, 22, 6, 'fun3', '', 'orcs_actions_wolfrider_fun_fun3.wav'),
(1079, 22, 1, 'ready1', '', 'orcs_actions_wolfrider_ready_ready1.wav'),
(1080, 22, 2, 'warcry1', '', 'orcs_actions_wolfrider_warcry_warcry1.wav'),
(1081, 22, 3, 'what2', '', 'orcs_actions_wolfrider_what_what2.wav'),
(1082, 22, 6, 'fun4', '', 'orcs_actions_wolfrider_fun_fun4.wav'),
(1083, 22, 3, 'what1', '', 'orcs_actions_wolfrider_what_what1.wav'),
(1084, 22, 4, 'yes1', '', 'orcs_actions_wolfrider_yes_yes1.wav'),
(1085, 22, 3, 'what3', '', 'orcs_actions_wolfrider_what_what3.wav'),
(1086, 22, 4, 'yes2', '', 'orcs_actions_wolfrider_yes_yes2.wav'),
(1087, 22, 3, 'what4', '', 'orcs_actions_wolfrider_what_what4.wav'),
(1089, 22, 4, 'yes4', '', 'orcs_actions_wolfrider_yes_yes4.wav'),
(1092, 22, 4, 'yes3', '', 'orcs_actions_wolfrider_yes_yes3.wav'),

(1088, 23, 5, 'attack1', '', 'orcs_actions_wyvernrider_attack_attack1.wav'),
(1090, 23, 5, 'attack2', '', 'orcs_actions_wyvernrider_attack_attack2.wav'),
(1091, 23, 5, 'attack3', '', 'orcs_actions_wyvernrider_attack_attack3.wav'),
(1093, 23, 5, 'attack4', '', 'orcs_actions_wyvernrider_attack_attack4.wav'),
(1094, 23, 6, 'fun2', '', 'orcs_actions_wyvernrider_fun_fun2.wav'),
(1095, 23, 7, 'death1', 'Mort', 'orcs_actions_wyvernrider_death_death1.wav'),
(1096, 23, 6, 'fun4', '', 'orcs_actions_wyvernrider_fun_fun4.wav'),
(1097, 23, 6, 'fun1', '', 'orcs_actions_wyvernrider_fun_fun1.wav'),
(1098, 23, 6, 'fun6', '', 'orcs_actions_wyvernrider_fun_fun6.wav'),
(1099, 23, 6, 'fun3', '', 'orcs_actions_wyvernrider_fun_fun3.wav'),
(1100, 23, 1, 'ready1', '', 'orcs_actions_wyvernrider_ready_ready1.wav'),
(1101, 23, 2, 'warcry1', '', 'orcs_actions_wyvernrider_warcry_warcry1.wav'),
(1102, 23, 3, 'what1', '', 'orcs_actions_wyvernrider_what_what1.wav'),
(1103, 23, 6, 'fun5', '', 'orcs_actions_wyvernrider_fun_fun5.wav'),
(1104, 23, 3, 'what2', '', 'orcs_actions_wyvernrider_what_what2.wav'),
(1105, 23, 6, 'fun7', '', 'orcs_actions_wyvernrider_fun_fun7.wav'),
(1106, 23, 3, 'what3', '', 'orcs_actions_wyvernrider_what_what3.wav'),
(1107, 23, 4, 'yes2', '', 'orcs_actions_wyvernrider_yes_yes2.wav'),
(1108, 23, 3, 'what4', '', 'orcs_actions_wyvernrider_what_what4.wav'),
(1109, 23, 4, 'yes1', '', 'orcs_actions_wyvernrider_yes_yes1.wav'),
(1111, 23, 4, 'yes3', '', 'orcs_actions_wyvernrider_yes_yes3.wav'),
(1113, 23, 4, 'yes4', '', 'orcs_actions_wyvernrider_yes_yes4.wav'),

(1110, 45, 5, 'attack1', '', 'undeads_actions_abomination_attack_attack1.wav'),
(1112, 45, 5, 'attack2', '', 'undeads_actions_abomination_attack_attack2.wav'),
(1114, 45, 5, 'attack4', '', 'undeads_actions_abomination_attack_attack4.wav'),
(1115, 45, 7, 'death1', 'Mort', 'undeads_actions_abomination_death_death1.wav'),
(1116, 45, 6, 'fun2', '', 'undeads_actions_abomination_fun_fun2.wav'),
(1117, 45, 5, 'attack3', '', 'undeads_actions_abomination_attack_attack3.wav'),
(1118, 45, 6, 'fun4', '', 'undeads_actions_abomination_fun_fun4.wav'),
(1119, 45, 6, 'fun3', '', 'undeads_actions_abomination_fun_fun3.wav'),
(1120, 45, 6, 'fun1', '', 'undeads_actions_abomination_fun_fun1.wav'),
(1121, 45, 1, 'ready1', 'J''obéis', 'undeads_actions_abomination_ready_ready1.wav'),
(1122, 45, 2, 'warcry1', 'Tous pour un', 'undeads_actions_abomination_warcry_warcry1.wav'),
(1123, 45, 6, 'fun5', '', 'undeads_actions_abomination_fun_fun5.wav'),
(1124, 45, 3, 'what1', 'Que faire', 'undeads_actions_abomination_what_what1.wav'),
(1125, 45, 3, 'what3', 'Quels ordres ?', 'undeads_actions_abomination_what_what3.wav'),
(1126, 45, 6, 'fun6', '', 'undeads_actions_abomination_fun_fun6.wav'),
(1127, 45, 3, 'what2', 'Gné ?', 'undeads_actions_abomination_what_what2.wav'),
(1128, 45, 4, 'yes1', 'Nous, aller', 'undeads_actions_abomination_yes_yes1.wav'),
(1129, 45, 4, 'yes2', 'Beuha', 'undeads_actions_abomination_yes_yes2.wav'),
(1130, 45, 3, 'what4', 'Mmmm', 'undeads_actions_abomination_what_what4.wav'),
(1131, 45, 4, 'yes5', '', 'undeads_actions_abomination_yes_yes5.wav'),
(1134, 45, 4, 'yes3', '', 'undeads_actions_abomination_yes_yes3.wav'),
(1138, 45, 4, 'yes4', '', 'undeads_actions_abomination_yes_yes4.wav'),

(1136, 42, 7, 'death1', 'Mort', 'undeads_actions_acolyte_death_death1.wav'),
(1137, 42, 6, 'fun1', '', 'undeads_actions_acolyte_fun_fun1.wav'),
(1132, 42, 5, 'attack1', '', 'undeads_actions_acolyte_attack_attack1.wav'),
(1133, 42, 5, 'attack2', '', 'undeads_actions_acolyte_attack_attack2.wav'),
(1135, 42, 5, 'attack3', '', 'undeads_actions_acolyte_attack_attack3.wav'),
(1139, 42, 6, 'fun2', '', 'undeads_actions_acolyte_fun_fun2.wav'),
(1140, 42, 6, 'fun3', '', 'undeads_actions_acolyte_fun_fun3.wav'),
(1141, 42, 6, 'fun4', '', 'undeads_actions_acolyte_fun_fun4.wav'),
(1142, 42, 6, 'fun6', '', 'undeads_actions_acolyte_fun_fun6.wav'),
(1143, 42, 6, 'fun7', '', 'undeads_actions_acolyte_fun_fun7.wav'),
(1144, 42, 6, 'fun8', '', 'undeads_actions_acolyte_fun_fun8.wav'),
(1145, 42, 1, 'ready1', '', 'undeads_actions_acolyte_ready_ready1.wav'),
(1146, 42, 2, 'warcry1', '', 'undeads_actions_acolyte_warcry_warcry1.wav'),
(1147, 42, 6, 'fun5', '', 'undeads_actions_acolyte_fun_fun5.wav'),
(1148, 42, 3, 'what1', '', 'undeads_actions_acolyte_what_what1.wav'),
(1149, 42, 3, 'what3', '', 'undeads_actions_acolyte_what_what3.wav'),
(1150, 42, 3, 'what4', '', 'undeads_actions_acolyte_what_what4.wav'),
(1151, 42, 3, 'what5', '', 'undeads_actions_acolyte_what_what5.wav'),
(1152, 42, 4, 'yes1', '', 'undeads_actions_acolyte_yes_yes1.wav'),
(1153, 42, 4, 'yes2', '', 'undeads_actions_acolyte_yes_yes2.wav'),
(1154, 42, 4, 'yes3', '', 'undeads_actions_acolyte_yes_yes3.wav'),
(1155, 42, 3, 'what2', '', 'undeads_actions_acolyte_what_what2.wav'),
(1160, 42, 4, 'yes4', '', 'undeads_actions_acolyte_yes_yes4.wav'),

(1156, 57, 5, 'attack1', '', 'undeads_actions_arthas_attack_attack1.wav'),
(1157, 57, 5, 'attack2', '', 'undeads_actions_arthas_attack_attack2.wav'),
(1158, 57, 5, 'attack4', '', 'undeads_actions_arthas_attack_attack4.wav'),
(1159, 57, 5, 'attack3', '', 'undeads_actions_arthas_attack_attack3.wav'),
(1161, 57, 5, 'attack5', '', 'undeads_actions_arthas_attack_attack5.wav'),
(1162, 57, 6, 'fun2', '', 'undeads_actions_arthas_fun_fun2.wav'),
(1163, 57, 5, 'attack6', '', 'undeads_actions_arthas_attack_attack6.wav'),
(1164, 57, 6, 'fun4', '', 'undeads_actions_arthas_fun_fun4.wav'),
(1165, 57, 6, 'fun3', '', 'undeads_actions_arthas_fun_fun3.wav'),
(1166, 57, 6, 'fun5', '', 'undeads_actions_arthas_fun_fun5.wav'),
(1167, 57, 6, 'fun6', '', 'undeads_actions_arthas_fun_fun6.wav'),
(1168, 57, 6, 'fun1', '', 'undeads_actions_arthas_fun_fun1.wav'),
(1169, 57, 2, 'warcry1', '', 'undeads_actions_arthas_warcry_warcry1.wav'),
(1170, 57, 3, 'what2', '', 'undeads_actions_arthas_what_what2.wav'),
(1171, 57, 3, 'what1', '', 'undeads_actions_arthas_what_what1.wav'),
(1172, 57, 6, 'fun7', '', 'undeads_actions_arthas_fun_fun7.wav'),
(1173, 57, 3, 'what3', '', 'undeads_actions_arthas_what_what3.wav'),
(1174, 57, 4, 'yes1', '', 'undeads_actions_arthas_yes_yes1.wav'),
(1175, 57, 3, 'what4', '', 'undeads_actions_arthas_what_what4.wav'),
(1176, 57, 3, 'what5', '', 'undeads_actions_arthas_what_what5.wav'),
(1177, 57, 4, 'yes4', '', 'undeads_actions_arthas_yes_yes4.wav'),
(1178, 57, 4, 'yes3', '', 'undeads_actions_arthas_yes_yes3.wav'),
(1182, 57, 4, 'yes2', '', 'undeads_actions_arthas_yes_yes2.wav'),

(1179, 47, 5, 'attack1', '', 'undeads_actions_banshee_attack_attack1.wav'),
(1180, 47, 5, 'attack2', '', 'undeads_actions_banshee_attack_attack2.wav'),
(1181, 47, 5, 'attack3', '', 'undeads_actions_banshee_attack_attack3.wav'),
(1183, 47, 5, 'ghostattack2', '', 'undeads_actions_banshee_attack_ghostattack2.wav'),
(1184, 47, 5, 'ghostattack1', '', 'undeads_actions_banshee_attack_ghostattack1.wav'),
(1185, 47, 7, 'ghostdeath1', '', 'undeads_actions_banshee_death_ghostdeath1.wav'),
(1186, 47, 6, 'fun2', '', 'undeads_actions_banshee_fun_fun2.wav'),
(1187, 47, 7, 'death1', 'Mort', 'undeads_actions_banshee_death_death1.wav'),
(1188, 47, 6, 'fun1', '', 'undeads_actions_banshee_fun_fun1.wav'),
(1189, 47, 6, 'fun3', '', 'undeads_actions_banshee_fun_fun3.wav'),
(1190, 47, 1, 'ready1', '', 'undeads_actions_banshee_ready_ready1.wav'),
(1191, 47, 2, 'warcry1', '', 'undeads_actions_banshee_warcry_warcry1.wav'),
(1192, 47, 6, 'fun4', '', 'undeads_actions_banshee_fun_fun4.wav'),
(1193, 47, 6, 'fun5', '', 'undeads_actions_banshee_fun_fun5.wav'),
(1194, 47, 3, 'ghostwhat1', '', 'undeads_actions_banshee_what_ghostwhat1.wav'),
(1195, 47, 3, 'what2', '', 'undeads_actions_banshee_what_what2.wav'),
(1196, 47, 3, 'what3', '', 'undeads_actions_banshee_what_what3.wav'),
(1197, 47, 3, 'what5', '', 'undeads_actions_banshee_what_what5.wav'),
(1198, 47, 3, 'what4', '', 'undeads_actions_banshee_what_what4.wav'),
(1199, 47, 4, 'ghostyes2', '', 'undeads_actions_banshee_yes_ghostyes2.wav'),
(1200, 47, 4, 'ghostyes1', '', 'undeads_actions_banshee_yes_ghostyes1.wav'),
(1201, 47, 4, 'yes2', '', 'undeads_actions_banshee_yes_yes2.wav'),
(1202, 47, 3, 'what1', '', 'undeads_actions_banshee_what_what1.wav'),
(1203, 47, 4, 'yes3', '', 'undeads_actions_banshee_yes_yes3.wav'),
(1204, 47, 4, 'yes1', '', 'undeads_actions_banshee_yes_yes1.wav'),
(1206, 47, 4, 'yes4', '', 'undeads_actions_banshee_yes_yes4.wav'),
(1210, 47, 4, 'yes5', '', 'undeads_actions_banshee_yes_yes5.wav'),

(1205, 44, 5, 'attack1', '', 'undeads_actions_cryptfiend_attack_attack1.wav'),
(1207, 44, 5, 'attack2', '', 'undeads_actions_cryptfiend_attack_attack2.wav'),
(1208, 44, 5, 'attack3', '', 'undeads_actions_cryptfiend_attack_attack3.wav'),
(1209, 44, 6, 'fun1', '', 'undeads_actions_cryptfiend_fun_fun1.wav'),
(1211, 44, 6, 'fun3', '', 'undeads_actions_cryptfiend_fun_fun3.wav'),
(1212, 44, 6, 'fun4', '', 'undeads_actions_cryptfiend_fun_fun4.wav'),
(1213, 44, 6, 'fun2', '', 'undeads_actions_cryptfiend_fun_fun2.wav'),
(1214, 44, 6, 'fun5', '', 'undeads_actions_cryptfiend_fun_fun5.wav'),
(1215, 44, 6, 'fun7', '', 'undeads_actions_cryptfiend_fun_fun7.wav'),
(1216, 44, 1, 'ready1', '', 'undeads_actions_cryptfiend_ready_ready1.wav'),
(1217, 44, 2, 'warcry1', '', 'undeads_actions_cryptfiend_warcry_warcry1.wav'),
(1218, 44, 6, 'fun6', '', 'undeads_actions_cryptfiend_fun_fun6.wav'),
(1219, 44, 3, 'what2', '', 'undeads_actions_cryptfiend_what_what2.wav'),
(1220, 44, 3, 'what4', '', 'undeads_actions_cryptfiend_what_what4.wav'),
(1221, 44, 3, 'what3', '', 'undeads_actions_cryptfiend_what_what3.wav'),
(1222, 44, 4, 'yes1', '', 'undeads_actions_cryptfiend_yes_yes1.wav'),
(1223, 44, 3, 'what1', '', 'undeads_actions_cryptfiend_what_what1.wav'),
(1224, 44, 4, 'yes4', '', 'undeads_actions_cryptfiend_yes_yes4.wav'),
(1225, 44, 4, 'yes2', '', 'undeads_actions_cryptfiend_yes_yes2.wav'),
(1227, 44, 4, 'yes3', '', 'undeads_actions_cryptfiend_yes_yes3.wav'),

(1226, 38, 5, 'attack2', '', 'undeads_actions_deathknight_attack_attack2.wav'),
(1228, 38, 5, 'attack1', '', 'undeads_actions_deathknight_attack_attack1.wav'),
(1229, 38, 7, 'death1', 'Mort', 'undeads_actions_deathknight_death_death1.wav'),
(1230, 38, 6, 'fun2', '', 'undeads_actions_deathknight_fun_fun2.wav'),
(1231, 38, 5, 'attack3', '', 'undeads_actions_deathknight_attack_attack3.wav'),
(1232, 38, 6, 'fun1', '', 'undeads_actions_deathknight_fun_fun1.wav'),
(1233, 38, 6, 'fun4', '', 'undeads_actions_deathknight_fun_fun4.wav'),
(1234, 38, 6, 'fun3', '', 'undeads_actions_deathknight_fun_fun3.wav'),
(1235, 38, 6, 'fun6', '', 'undeads_actions_deathknight_fun_fun6.wav'),
(1236, 38, 1, 'ready1', '', 'undeads_actions_deathknight_ready_ready1.wav'),
(1237, 38, 2, 'warcry1', '', 'undeads_actions_deathknight_warcry_warcry1.wav'),
(1238, 38, 6, 'fun5', '', 'undeads_actions_deathknight_fun_fun5.wav'),
(1239, 38, 3, 'what1', '', 'undeads_actions_deathknight_what_what1.wav'),
(1240, 38, 3, 'what2', '', 'undeads_actions_deathknight_what_what2.wav'),
(1241, 38, 3, 'what4', '', 'undeads_actions_deathknight_what_what4.wav'),
(1242, 38, 4, 'yes1', '', 'undeads_actions_deathknight_yes_yes1.wav'),
(1243, 38, 3, 'what3', '', 'undeads_actions_deathknight_what_what3.wav'),
(1244, 38, 4, 'yes4', '', 'undeads_actions_deathknight_yes_yes4.wav'),
(1245, 38, 4, 'yes5', '', 'undeads_actions_deathknight_yes_yes5.wav'),
(1246, 38, 4, 'yes2', '', 'undeads_actions_deathknight_yes_yes2.wav'),
(1250, 38, 4, 'yes3', '', 'undeads_actions_deathknight_yes_yes3.wav'),

(1247, 40, 5, 'attack2', '', 'undeads_actions_dreadlord_attack_attack2.wav'),
(1248, 40, 5, 'attack1', '', 'undeads_actions_dreadlord_attack_attack1.wav'),
(1249, 40, 5, 'attack3', '', 'undeads_actions_dreadlord_attack_attack3.wav'),
(1251, 40, 7, 'death1', 'Mort', 'undeads_actions_dreadlord_death_death1.wav'),
(1252, 40, 6, 'fun2', '', 'undeads_actions_dreadlord_fun_fun2.wav'),
(1253, 40, 6, 'fun4', '', 'undeads_actions_dreadlord_fun_fun4.wav'),
(1254, 40, 6, 'fun5', '', 'undeads_actions_dreadlord_fun_fun5.wav'),
(1255, 40, 6, 'fun3', '', 'undeads_actions_dreadlord_fun_fun3.wav'),
(1256, 40, 6, 'fun6', '', 'undeads_actions_dreadlord_fun_fun6.wav'),
(1257, 40, 6, 'fun7', '', 'undeads_actions_dreadlord_fun_fun7.wav'),
(1258, 40, 1, 'ready1', '', 'undeads_actions_dreadlord_ready_ready1.wav'),
(1259, 40, 2, 'warcry1', '', 'undeads_actions_dreadlord_warcry_warcry1.wav'),
(1260, 40, 3, 'what1', '', 'undeads_actions_dreadlord_what_what1.wav'),
(1261, 40, 6, 'fun1', '', 'undeads_actions_dreadlord_fun_fun1.wav'),
(1262, 40, 3, 'what2', '', 'undeads_actions_dreadlord_what_what2.wav'),
(1263, 40, 4, 'yes1', '', 'undeads_actions_dreadlord_yes_yes1.wav'),
(1264, 40, 3, 'what3', '', 'undeads_actions_dreadlord_what_what3.wav'),
(1265, 40, 4, 'yes3', '', 'undeads_actions_dreadlord_yes_yes3.wav'),
(1266, 40, 3, 'what4', '', 'undeads_actions_dreadlord_what_what4.wav'),
(1267, 40, 4, 'yes2', '', 'undeads_actions_dreadlord_yes_yes2.wav'),
(1269, 40, 4, 'yes4', '', 'undeads_actions_dreadlord_yes_yes4.wav'),

(1268, 43, 5, 'attack1', '', 'undeads_actions_ghoul_attack_attack1.wav'),
(1270, 43, 5, 'attack2', '', 'undeads_actions_ghoul_attack_attack2.wav'),
(1271, 43, 5, 'attack4', '', 'undeads_actions_ghoul_attack_attack4.wav'),
(1272, 43, 7, 'death1', 'Mort', 'undeads_actions_ghoul_death_death1.wav'),
(1273, 43, 6, 'fun1', '', 'undeads_actions_ghoul_fun_fun1.wav'),
(1274, 43, 5, 'attack3', '', 'undeads_actions_ghoul_attack_attack3.wav'),
(1275, 43, 6, 'fun2', '', 'undeads_actions_ghoul_fun_fun2.wav'),
(1276, 43, 1, 'ready1', '', 'undeads_actions_ghoul_ready_ready1.wav'),
(1277, 43, 6, 'fun4', '', 'undeads_actions_ghoul_fun_fun4.wav'),
(1278, 43, 2, 'warcry1', '', 'undeads_actions_ghoul_warcry_warcry1.wav'),
(1279, 43, 6, 'fun3', '', 'undeads_actions_ghoul_fun_fun3.wav'),
(1280, 43, 3, 'what1', '', 'undeads_actions_ghoul_what_what1.wav'),
(1281, 43, 3, 'what4', '', 'undeads_actions_ghoul_what_what4.wav'),
(1282, 43, 3, 'what3', '', 'undeads_actions_ghoul_what_what3.wav'),
(1283, 43, 4, 'yes1', '', 'undeads_actions_ghoul_yes_yes1.wav'),
(1284, 43, 3, 'what2', '', 'undeads_actions_ghoul_what_what2.wav'),
(1285, 43, 4, 'yes4', '', 'undeads_actions_ghoul_yes_yes4.wav'),
(1286, 43, 4, 'yes2', '', 'undeads_actions_ghoul_yes_yes2.wav'),
(1288, 43, 4, 'yes3', '', 'undeads_actions_ghoul_yes_yes3.wav'),

(1287, 83, 5, 'attack1', '', 'undeads_actions_kelthuzad_attack_attack1.wav'),
(1289, 83, 5, 'attack3', '', 'undeads_actions_kelthuzad_attack_attack3.wav'),
(1290, 83, 6, 'fun1', '', 'undeads_actions_kelthuzad_fun_fun1.wav'),
(1291, 83, 5, 'attack2', '', 'undeads_actions_kelthuzad_attack_attack2.wav'),
(1292, 83, 7, 'death1', '', 'undeads_actions_kelthuzad_death_death1.wav'),
(1293, 83, 6, 'fun3', '', 'undeads_actions_kelthuzad_fun_fun3.wav'),
(1294, 83, 6, 'fun4', '', 'undeads_actions_kelthuzad_fun_fun4.wav'),
(1295, 83, 6, 'fun2', '', 'undeads_actions_kelthuzad_fun_fun2.wav'),
(1296, 83, 2, 'warcry1', '', 'undeads_actions_kelthuzad_warcry_warcry1.wav'),
(1297, 83, 3, 'what1', '', 'undeads_actions_kelthuzad_what_what1.wav'),
(1298, 83, 3, 'what3', '', 'undeads_actions_kelthuzad_what_what3.wav'),
(1299, 83, 3, 'what2', '', 'undeads_actions_kelthuzad_what_what2.wav'),
(1300, 83, 4, 'yes1', '', 'undeads_actions_kelthuzad_yes_yes1.wav'),
(1301, 83, 3, 'what4', '', 'undeads_actions_kelthuzad_what_what4.wav'),
(1302, 83, 4, 'yes3', '', 'undeads_actions_kelthuzad_yes_yes3.wav'),
(1303, 83, 4, 'yes2', '', 'undeads_actions_kelthuzad_yes_yes2.wav'),
(1304, 83, 6, 'fun5', '', 'undeads_actions_kelthuzad_fun_fun5.wav'),
(1308, 83, 4, 'yes4', '', 'undeads_actions_kelthuzad_yes_yes4.wav'),

(1305, 39, 5, 'attack1', '', 'undeads_actions_lich_attack_attack1.wav'),
(1306, 39, 5, 'attack2', '', 'undeads_actions_lich_attack_attack2.wav'),
(1307, 39, 7, 'death1', 'Mort', 'undeads_actions_lich_death_death1.wav'),
(1309, 39, 5, 'attack3', '', 'undeads_actions_lich_attack_attack3.wav'),
(1310, 39, 6, 'fun1', '', 'undeads_actions_lich_fun_fun1.wav'),
(1311, 39, 6, 'fun4', '', 'undeads_actions_lich_fun_fun4.wav'),
(1312, 39, 6, 'fun3', '', 'undeads_actions_lich_fun_fun3.wav'),
(1313, 39, 6, 'fun6', '', 'undeads_actions_lich_fun_fun6.wav'),
(1314, 39, 6, 'fun5', '', 'undeads_actions_lich_fun_fun5.wav'),
(1315, 39, 6, 'fun2', '', 'undeads_actions_lich_fun_fun2.wav'),
(1316, 39, 6, 'fun7', '', 'undeads_actions_lich_fun_fun7.wav'),
(1317, 39, 1, 'ready1', '', 'undeads_actions_lich_ready_ready1.wav'),
(1318, 39, 2, 'warcry1', '', 'undeads_actions_lich_warcry_warcry1.wav'),
(1319, 39, 3, 'what2', '', 'undeads_actions_lich_what_what2.wav'),
(1320, 39, 3, 'what1', '', 'undeads_actions_lich_what_what1.wav'),
(1321, 39, 6, 'fun8', '', 'undeads_actions_lich_fun_fun8.wav'),
(1322, 39, 3, 'what3', '', 'undeads_actions_lich_what_what3.wav'),
(1323, 39, 4, 'yes2', '', 'undeads_actions_lich_yes_yes2.wav'),
(1324, 39, 3, 'what4', '', 'undeads_actions_lich_what_what4.wav'),
(1325, 39, 4, 'yes4', '', 'undeads_actions_lich_yes_yes4.wav'),
(1326, 39, 4, 'yes5', '', 'undeads_actions_lich_yes_yes5.wav'),
(1329, 39, 4, 'yes1', '', 'undeads_actions_lich_yes_yes1.wav'),,
(1334, 39, 4, 'yes3', '', 'undeads_actions_lich_yes_yes3.wav'),

(1330, 46, 5, 'attack3', '', 'undeads_actions_necromancer_attack_attack3.wav'),
(1331, 46, 7, 'death1', 'Mort', 'undeads_actions_necromancer_death_death1.wav'),
(1332, 46, 6, 'fun2', '', 'undeads_actions_necromancer_fun_fun2.wav'),
(1333, 46, 6, 'fun3', '', 'undeads_actions_necromancer_fun_fun3.wav')
(1327, 46, 5, 'attack1', '', 'undeads_actions_necromancer_attack_attack1.wav'),
(1328, 46, 5, 'attack2', '', 'undeads_actions_necromancer_attack_attack2.wav'),
(1335, 46, 6, 'fun4', '', 'undeads_actions_necromancer_fun_fun4.wav'),
(1336, 46, 1, 'ready1', '', 'undeads_actions_necromancer_ready_ready1.wav'),
(1337, 46, 2, 'warcry1', '', 'undeads_actions_necromancer_warcry_warcry1.wav'),
(1338, 46, 6, 'fun1', '', 'undeads_actions_necromancer_fun_fun1.wav'),
(1339, 46, 3, 'what1', '', 'undeads_actions_necromancer_what_what1.wav'),
(1340, 46, 3, 'what2', '', 'undeads_actions_necromancer_what_what2.wav'),
(1341, 46, 3, 'what4', '', 'undeads_actions_necromancer_what_what4.wav'),
(1342, 46, 6, 'fun5', '', 'undeads_actions_necromancer_fun_fun5.wav'),
(1343, 46, 3, 'what3', '', 'undeads_actions_necromancer_what_what3.wav'),
(1344, 46, 4, 'yes3', '', 'undeads_actions_necromancer_yes_yes3.wav'),
(1345, 46, 4, 'yes1', '', 'undeads_actions_necromancer_yes_yes1.wav'),
(1346, 46, 4, 'yes4', '', 'undeads_actions_necromancer_yes_yes4.wav'),
(1349, 46, 4, 'yes2', '', 'undeads_actions_necromancer_yes_yes2.wav'),

(1347, 48, 5, 'attack1', '', 'undeads_actions_shade_attack_attack1.wav'),
(1348, 48, 5, 'attack2', '', 'undeads_actions_shade_attack_attack2.wav'),
(1350, 48, 5, 'attack4', '', 'undeads_actions_shade_attack_attack4.wav'),
(1351, 48, 7, 'death1', 'Mort', 'undeads_actions_shade_death_death1.wav'),
(1352, 48, 5, 'attack5', '', 'undeads_actions_shade_attack_attack5.wav'),
(1353, 48, 5, 'attack3', '', 'undeads_actions_shade_attack_attack3.wav'),
(1354, 48, 6, 'fun2', '', 'undeads_actions_shade_fun_fun2.wav'),
(1355, 48, 6, 'fun4', '', 'undeads_actions_shade_fun_fun4.wav'),
(1356, 48, 6, 'fun1', '', 'undeads_actions_shade_fun_fun1.wav'),
(1357, 48, 6, 'fun5', '', 'undeads_actions_shade_fun_fun5.wav'),
(1358, 48, 1, 'ready1', '', 'undeads_actions_shade_ready_ready1.wav'),
(1359, 48, 6, 'fun3', '', 'undeads_actions_shade_fun_fun3.wav'),
(1360, 48, 2, 'warcry1', '', 'undeads_actions_shade_warcry_warcry1.wav'),
(1361, 48, 3, 'what1', '', 'undeads_actions_shade_what_what1.wav'),
(1362, 48, 3, 'what2', '', 'undeads_actions_shade_what_what2.wav'),
(1363, 48, 3, 'what3', '', 'undeads_actions_shade_what_what3.wav'),
(1364, 48, 4, 'yes1', '', 'undeads_actions_shade_yes_yes1.wav'),
(1365, 48, 4, 'yes2', '', 'undeads_actions_shade_yes_yes2.wav'),
(1366, 48, 4, 'yes4', '', 'undeads_actions_shade_yes_yes4.wav'),
(1367, 48, 4, 'yes3', '', 'undeads_actions_shade_yes_yes3.wav'),
(1370, 48, 6, 'fun6', '', 'undeads_actions_shade_fun_fun6.wav'),

(1368, 85, 5, 'attack1', '', 'undeads_actions_tichondrius_attack_attack1.wav'),
(1369, 85, 5, 'attack2', '', 'undeads_actions_tichondrius_attack_attack2.wav'),
(1371, 85, 6, 'fun1', '', 'undeads_actions_tichondrius_fun_fun1.wav'),
(1372, 85, 5, 'attack3', '', 'undeads_actions_tichondrius_attack_attack3.wav'),
(1373, 85, 6, 'fun2', '', 'undeads_actions_tichondrius_fun_fun2.wav'),
(1374, 85, 6, 'fun5', '', 'undeads_actions_tichondrius_fun_fun5.wav'),
(1375, 85, 6, 'fun4', '', 'undeads_actions_tichondrius_fun_fun4.wav'),
(1376, 85, 2, 'warcry1', '', 'undeads_actions_tichondrius_warcry_warcry1.wav'),
(1377, 85, 3, 'what1', '', 'undeads_actions_tichondrius_what_what1.wav'),
(1378, 85, 6, 'fun3', '', 'undeads_actions_tichondrius_fun_fun3.wav'),
(1379, 85, 3, 'what2', '', 'undeads_actions_tichondrius_what_what2.wav'),
(1380, 85, 3, 'what4', '', 'undeads_actions_tichondrius_what_what4.wav'),
(1381, 85, 4, 'yes1', '', 'undeads_actions_tichondrius_yes_yes1.wav'),
(1382, 85, 3, 'what3', '', 'undeads_actions_tichondrius_what_what3.wav'),
(1383, 85, 4, 'yes2', '', 'undeads_actions_tichondrius_yes_yes2.wav'),
(1384, 85, 4, 'yes3', '', 'undeads_actions_tichondrius_yes_yes3.wav'),
(1385, 85, 4, 'yes4', '', 'undeads_actions_tichondrius_yes_yes4.wav');
