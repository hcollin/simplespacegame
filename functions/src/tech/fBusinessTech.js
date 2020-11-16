"use strict";
exports.__esModule = true;
var fDataTechnology_1 = require("../data/fDataTechnology");
var fTechTools_1 = require("./fTechTools");
function techMarketing(faction, game) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Marketing))
        return 0;
    var totEco = game.systems.reduce(function (tot, sm) {
        if (sm.ownerFactionId === faction.id) {
            return tot + sm.economy;
        }
        return tot;
    }, 0);
    return Math.floor(totEco / 5);
}
exports.techMarketing = techMarketing;
function techDecisionEngine(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Marketing))
        return 10;
    return 7;
}
exports.techDecisionEngine = techDecisionEngine;
function techHigherEducation(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.HigherEdu))
        return [0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4];
    return [0, 1, 2, 2, 1, 0, 0, -1, -2, -3, -3, -4, -5];
}
exports.techHigherEducation = techHigherEducation;
