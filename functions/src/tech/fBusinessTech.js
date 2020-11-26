"use strict";
exports.__esModule = true;
var fDataTechnology_1 = require("../data/fDataTechnology");
var fModels_1 = require("../models/fModels");
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
function techInitEcoBoost(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.InitEcoBoost))
        return 0;
    return 0;
}
exports.techInitEcoBoost = techInitEcoBoost;
function techMerchantGuild(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.MerchGuilds))
        return 0;
    return 2;
}
exports.techMerchantGuild = techMerchantGuild;
function techMineralPros(faction, star) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.MineralPros))
        return 0;
    if (!star.keywords.includes(fModels_1.SystemKeyword.MINERALRARE) && !star.keywords.includes(fModels_1.SystemKeyword.MINERALRICH)) {
        return 0;
    }
    return 1;
}
exports.techMineralPros = techMineralPros;
function techAlternativePros(faction, star) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AlterPros))
        return 0;
    if (!star.keywords.includes(fModels_1.SystemKeyword.MINERALPOOR)) {
        return 0;
    }
    return 1;
}
exports.techAlternativePros = techAlternativePros;
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
function techGalacticSenate(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.GalacticSen))
        return 0;
    return 1;
}
exports.techGalacticSenate = techGalacticSenate;
function techAdaptability(faction, star, current) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Adaptability))
        return current;
    if (!star.keywords.includes(fModels_1.SystemKeyword.HOSTILE))
        return current;
    if (current > 3)
        return current;
    return 3;
}
exports.techAdaptability = techAdaptability;
function techEfficientBureaucracy(faction, cost) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.EfficientBur))
        return cost;
    return cost > 1 ? cost - 1 : cost;
}
exports.techEfficientBureaucracy = techEfficientBureaucracy;
function techSpaceDock(faction, star) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.SpaceDock))
        return 1;
    if (star.industry < 5)
        return 1;
    return 2;
}
exports.techSpaceDock = techSpaceDock;
function techUndergroundConstruction(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Ugconstruc))
        return 0;
    return 1;
}
exports.techUndergroundConstruction = techUndergroundConstruction;
function techLevitationBuildings(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.LevitatBuild))
        return 0;
    return 1;
}
exports.techLevitationBuildings = techLevitationBuildings;
function techExpansionist(faction, stars) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Expansionist))
        return 0;
    return Math.floor(stars.reduce(function (tot, sm) {
        if (sm.ownerFactionId === faction.id) {
            return tot + 1;
        }
        return tot;
    }, 0) / 7);
}
exports.techExpansionist = techExpansionist;
function techCapitalist(faction, stars) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Expansionist))
        return 0;
    return (Math.floor(stars.reduce(function (tot, sm) {
        if (sm.ownerFactionId === faction.id) {
            return tot + 1;
        }
        return tot;
    }, 0) / 7) * 5);
}
exports.techCapitalist = techCapitalist;
function techScientist(faction, stars) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.Expansionist))
        return 0;
    return (Math.floor(stars.reduce(function (tot, sm) {
        if (sm.ownerFactionId === faction.id) {
            return tot + 1;
        }
        return tot;
    }, 0) / 7) * 3);
}
exports.techScientist = techScientist;
function techDysonSphere(faction) {
    return fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.DysonShpe);
}
exports.techDysonSphere = techDysonSphere;
