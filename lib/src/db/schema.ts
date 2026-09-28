// deps

    // externals
    import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

// module

export const races = sqliteTable("races", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull(),
    "icon": text("icon", { "length": 100 }).notNull()
}, (table) => {

    return [ unique().on(table.code) ];

});

export const actionsTypes = sqliteTable("actions_types", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull()
}, (table) => {

    return [ unique().on(table.code) ];

});

export const musics = sqliteTable("musics", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "k_race": integer("k_race").notNull().references(() => {

        return races.id;

    }, {
        "onDelete": "cascade",
        "onUpdate": "cascade"
    }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull(),
    "file": text("file", { "length": 50 }).notNull()
}, (table) => {

    return [ unique().on(table.k_race, table.code) ];

});

export const warnings = sqliteTable("warnings", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "k_race": integer("k_race").notNull().references(() => {

        return races.id;

    }, {
        "onDelete": "cascade",
        "onUpdate": "cascade"
    }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull(),
    "file": text("file", { "length": 50 }).notNull()
}, (table) => {

    return [ unique().on(table.k_race, table.code) ];

});

export const characters = sqliteTable("characters", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "k_race": integer("k_race").notNull().references(() => {

        return races.id;

    }, {
        "onDelete": "cascade",
        "onUpdate": "cascade"
    }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull(),
    "icon": text("icon", { "length": 100 }).notNull(),
    "hero": integer("hero", { "mode": "boolean" }).notNull().default(false),
    "tft": integer("tft", { "mode": "boolean" }).notNull().default(false)
}, (table) => {

    return [ unique().on(table.k_race, table.code) ];

});

export const actions = sqliteTable("actions", {
    "id": integer("id").primaryKey({ "autoIncrement": true }),
    "k_character": integer("k_character").notNull().references(() => {

        return characters.id;

    }, {
        "onDelete": "cascade",
        "onUpdate": "cascade"
    }),
    "k_action_type": integer("k_action_type").notNull().references(() => {

        return actionsTypes.id;

    }, {
        "onDelete": "cascade",
        "onUpdate": "cascade"
    }),
    "code": text("code", { "length": 20 }).notNull(),
    "name": text("name", { "length": 25 }).notNull(),
    "file": text("file", { "length": 50 }).notNull()
}, (table) => {

    return [ unique().on(table.k_character, table.k_action_type, table.code) ];

});
