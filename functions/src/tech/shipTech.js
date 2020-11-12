"use strict";
exports.__esModule = true;
exports.techTimeslipPrediction = exports.techEvasionEngine = exports.techHeavyRounds = exports.techTargetingComputerThree = exports.techTargetingComputerTwo = exports.techTargetingComputerOne = exports.techWarpEngines = exports.techIonEngines = void 0;
var dataTechnology_1 = require("../data/dataTechnology");
var techTools_1 = require("./techTools");
/**
 * Technology function for IonEngines
 */
function techIonEngines(faction) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.IonEngines))
        return 0;
    return 1;
}
exports.techIonEngines = techIonEngines;
/**
 * Returns the adjustment for speed for units for factions with Warp Engines
 * @param
 */
function techWarpEngines(faction) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.WarpEngines))
        return 0;
    return 3;
}
exports.techWarpEngines = techWarpEngines;
function techTargetingComputerOne(faction) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.TargetingComp1))
        return 0;
    return 5;
}
exports.techTargetingComputerOne = techTargetingComputerOne;
function techTargetingComputerTwo(faction) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.TargetingComp2))
        return 0;
    return 5;
}
exports.techTargetingComputerTwo = techTargetingComputerTwo;
function techTargetingComputerThree(faction) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.TargetingComp3))
        return 0;
    return 10;
}
exports.techTargetingComputerThree = techTargetingComputerThree;
function techHeavyRounds(faction, damage) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.HeavyRounds))
        return damage;
    if (Array.isArray(damage)) {
        return [Math.round(damage[0] * 1.1), Math.round(damage[1] * 1.1)];
    }
    return Math.round(damage * 1.1);
}
exports.techHeavyRounds = techHeavyRounds;
function techEvasionEngine(faction, agility) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.EvasionEngine))
        return agility;
    return Math.round(agility * 1.1);
}
exports.techEvasionEngine = techEvasionEngine;
function techTimeslipPrediction(faction, agility) {
    if (!techTools_1.factionHasTechnology(faction, dataTechnology_1.TECHIDS.PredEvasion))
        return agility;
    return Math.round(agility + 10);
}
exports.techTimeslipPrediction = techTimeslipPrediction;
