"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getFactionShips = exports.factionCanDoMoreCommands = exports.getFactionByUserId = exports.getFactionFromArrayById = exports.createNewFaction = exports.getFactionName = void 0;
var dataShips_1 = require("../../data/dataShips");
var dataTechnology_1 = require("../../data/dataTechnology");
var dataUser_1 = require("../../data/dataUser.");
var Models_1 = require("../../models/Models");
var factionUtils_1 = require("../../utils/factionUtils");
var randUtils_1 = require("../../utils/randUtils");
var factionColors = randUtils_1.shuffle(['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4']);
var factNamePart1 = ["Federation of", "Kingdom of", "Empire of", "Republic of", "Commonwealth of", "Tribe of", "Hive of", "Imperium of", "Clan of", "Culture of", "Theocracy of", "Barony of", "Democracy of", "Army of", "Consortium of", "Cohorts of", "Remnants of", "Oligarchy of", "Aristocracy of", "Tyranny of", "United States of", "Church of", "League of", "Protectorate of", "Colony of", "Alliance of", "Hegemony of", "Confederation of", "Matriarchy of"];
var factNamePart2 = ["Space", "Pirate", "Warrior", "Engineer", "Merchant", "Priest", "Soldier", "Peace", "Holy", "Unholy", "Ancient", "Future", "Bio", "Cyber", "Renegade", "Telepathic", "Magical", "Robotic", "Artificial", "Psychic", "Fanatic", "Conservative", "Liberal", "Nihilistic", "Chaos", "Multi Dimensional", "Flux", "Power", "Giant", "Ravenous", "World Eating", "Cannibalistic", "Occultist", "Death", "Turbo", "Spotted", "Angry", "Cunning", "Lounge", "Parasitic", "Necro"];
var factNamePart3 = ["Cats", "Dogs", "Turtles", "Wolves", "Lions", "Elephants", "Wasps", "Spiders", "Scorpions", "Parrots", "Eagles", "Reptiles", "Worms", "Serpents", "Ants", "Whales", "Octopuses", "Rhinos", "Sharks", "Gorillas", "Tigers", "Jaguars", "Hyenas", "Hamsters", "Rodents", "Baboons", "Bears", "Moose", "Deer", "Flies", "Owls", "Vultures", "Rabbits", "Kangaroos", "Penguins", "Dragons", "Horses", "Cows", "Pigs", "Sheep", "Chickens", "Giraffes", "Otters", "Medusas", "Fish", "Roaches", "Bugs"];
var np1s = randUtils_1.arnds(factNamePart1, 12, true);
var np2s = randUtils_1.arnds(factNamePart2, 12, true);
var np3s = randUtils_1.arnds(factNamePart3, 12, true);
var factionNoId = -1;
var players = __spreadArrays(dataUser_1["default"]);
var fonts = randUtils_1.shuffle([
    "Impact",
    "Averia Serif Libre",
    "Bebas Neue",
    "Carter One",
    "Coda",
    "Fugaz One",
    "Piedra",
    "Righteous",
    "Staatliches",
    "Trade Winds",
    "Candara",
]);
function getFactionName() {
    factionNoId++;
    return np1s[factionNoId] + " " + np2s[factionNoId] + " " + np3s[factionNoId];
}
exports.getFactionName = getFactionName;
function createNewFaction() {
    var pl = players.shift();
    var ff = fonts.shift();
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
        technology: [dataTechnology_1.TECHIDS.EvasionEngine, dataTechnology_1.TECHIDS.PredEvasion]
    };
    return fm;
}
exports.createNewFaction = createNewFaction;
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
