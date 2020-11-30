"use strict";
exports.__esModule = true;
var fDataTechnology_1 = require("../data/fDataTechnology");
var fTechTools_1 = require("./fTechTools");
function techAutoDefenses(faction) {
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AutoDef3))
        return 5;
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AutoDef2))
        return 3;
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AutoDef1))
        return 1;
    return 0;
}
exports.techAutoDefenses = techAutoDefenses;
function techDroidDefences(faction) {
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.DriodDef))
        return 2;
    return 1;
}
exports.techDroidDefences = techDroidDefences;
function techSpaceMarine(faction) {
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.SpaceMarine2))
        return 3;
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.SpaceMarine1))
        return 1;
    return 0;
}
exports.techSpaceMarine = techSpaceMarine;
function techTerminatorTroops(faction, troops) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.TermiTroops))
        return troops;
    return Math.round(troops * 1.5);
}
exports.techTerminatorTroops = techTerminatorTroops;
