"use strict";
// import { FACTION_COLORS, FACTION_FONTS, FACTION_NAMES } from "../../configs";
// import DATASHIPS from "../../data/dataShips";
// // import { TECHIDS } from "../../data/dataTechnology";
// import DATAUSERS from "../../data/dataUser.";
// import { Command } from "../../models/Commands";
// import { FactionModel, FactionSetup, FactionState, GameModel, TechnologyField } from "../../models/Models";
// import { ShipDesign } from "../../models/Units";
// import { factionValues } from "../../utils/factionUtils";
// import { arnd, arnds, prnd, rnd, shuffle } from "../../utils/randUtils";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getFactionShips = exports.factionCanDoMoreCommands = exports.getFactionByUserId = exports.getFactionFromArrayById = exports.testFn = exports.createNewFaction = exports.getFactionName = exports.randomFactionName = exports.getColors = exports.getFactionFonts = void 0;
var configs_1 = require("../../configs");
var dataShips_1 = require("../../data/dataShips");
var dataUser_1 = require("../../data/dataUser.");
var Models_1 = require("../../models/Models");
var factionUtils_1 = require("../../utils/factionUtils");
var randUtils_1 = require("../../utils/randUtils");
var factionColors = randUtils_1.shuffle(configs_1.FACTION_COLORS);
var factNamePart1 = configs_1.FACTION_NAMES[0];
var factNamePart2 = configs_1.FACTION_NAMES[1];
var factNamePart3 = configs_1.FACTION_NAMES[2];
var np1s = randUtils_1.arnds(factNamePart1, 12, true);
var np2s = randUtils_1.arnds(factNamePart2, 12, true);
var np3s = randUtils_1.arnds(factNamePart3, 12, true);
var factionNoId = -1;
var players = __spreadArrays(dataUser_1["default"]);
var factionFonts = randUtils_1.shuffle(configs_1.FACTION_FONTS);
// export function crFckFrmStp(setup: FactionSetup): FactionModel {
//     const fm: FactionModel = {
//         id: v4(),
//         money: 3,
//         technologyFields: [
//             { field: TechnologyField.BIOLOGY, points: 0, priority: 0 },
//             { field: TechnologyField.SOCIOLOGY, points: 0, priority: 0 },
//             { field: TechnologyField.BUSINESS, points: 0, priority: 0 },
//             { field: TechnologyField.INFORMATION, points: 0, priority: 0 },
//             { field: TechnologyField.CHEMISTRY, points: 0, priority: 0 },
//             { field: TechnologyField.PHYSICS, points: 0, priority: 0 },
//         ],
//         state: FactionState.PLAYING,
//         name: setup.name,
//         playerId: setup.playerId,
//         color: setup.color,
//         iconFileName: setup.iconFileName,
//         style: {
//             fontFamily: setup.fontFamily,
//         },
//         technology: [],
//     };
//     return fm;
// }
function getFactionFonts() {
    return factionFonts;
}
exports.getFactionFonts = getFactionFonts;
function getColors() {
    return factionColors;
}
exports.getColors = getColors;
function randomFactionName() {
    return randUtils_1.arnd(factNamePart1) + " " + randUtils_1.arnd(factNamePart2) + " " + randUtils_1.arnd(factNamePart3);
}
exports.randomFactionName = randomFactionName;
function getFactionName() {
    factionNoId++;
    return np1s[factionNoId] + " " + np2s[factionNoId] + " " + np3s[factionNoId];
}
exports.getFactionName = getFactionName;
function createNewFaction() {
    var pl = players.shift();
    var ff = factionFonts.shift();
    var fm = {
        id: "faction-" + randUtils_1.rnd(1, 9999),
        money: 3,
        technologyFields: [
            { field: Models_1.TechnologyField.BIOLOGY, points: 0, priority: 0 },
            { field: Models_1.TechnologyField.SOCIOLOGY, points: 0, priority: 0 },
            { field: Models_1.TechnologyField.BUSINESS, points: 0, priority: 0 },
            { field: Models_1.TechnologyField.INFORMATION, points: 0, priority: 0 },
            { field: Models_1.TechnologyField.CHEMISTRY, points: 0, priority: 0 },
            { field: Models_1.TechnologyField.PHYSICS, points: 0, priority: 0 },
        ],
        state: Models_1.FactionState.PLAYING,
        name: getFactionName(),
        playerId: pl ? pl.id : "",
        color: factionColors.pop() || "#FFF",
        iconFileName: "abstract-" + randUtils_1.prnd(1, 120) + ".svg",
        style: {
            fontFamily: ff || "Arial"
        },
        technology: []
    };
    return fm;
}
exports.createNewFaction = createNewFaction;
function testFn() {
}
exports.testFn = testFn;
// export function createFactionFromSetup(setup: FactionSetup): FactionModel {
//     const fm: FactionModel = {
//         id: v4(),
//         money: 3,
//         technologyFields: [
//             {field: TechnologyField.BIOLOGY, points: 0, priority: 0},
//             {field: TechnologyField.SOCIOLOGY, points: 0, priority: 0},
//             {field: TechnologyField.BUSINESS, points: 0, priority: 0},
//             {field: TechnologyField.INFORMATION, points: 0, priority: 0},
//             {field: TechnologyField.CHEMISTRY, points: 0, priority: 0},
//             {field: TechnologyField.PHYSICS, points: 0, priority: 0},
//         ],
//         state: FactionState.PLAYING,
//         name: setup.name,
//         playerId: setup.playerId,
//         color: setup.color,
//         iconFileName: setup.iconFileName,
//         style: {
//             fontFamily: setup.fontFamily,
//         },
//         technology: [],
//     };
//     return fm;
// }
function getFactionFromArrayById(factions, id) {
    return factions.find(function (fm) { return fm.id === id; });
}
exports.getFactionFromArrayById = getFactionFromArrayById;
function getFactionByUserId(factions, userId) {
    return factions.find(function (fm) { return fm.playerId === userId; });
}
exports.getFactionByUserId = getFactionByUserId;
function factionCanDoMoreCommands(game, commands, faction) {
    // const game = joki.service.getState("GameService") as GameModel;
    var values = factionUtils_1.factionValues(game, faction.id);
    // const commands = joki.service.getState("CommandService") as Command[];
    var myCommands = commands.filter(function (cm) { return cm.factionId === faction.id; });
    return myCommands.length < values.maxCommands;
}
exports.factionCanDoMoreCommands = factionCanDoMoreCommands;
function getFactionShips(factionId) {
    return dataShips_1["default"];
}
exports.getFactionShips = getFactionShips;
