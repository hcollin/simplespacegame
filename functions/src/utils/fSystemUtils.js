"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getSystemByCoordinates = exports.getSystemDefence = exports.getSystemMaxBuildingSlots = exports.getStarWelfareMax = exports.getStarDefenceMax = exports.getStarEconomyMax = exports.getStarIndustryMax = exports.getSystemEconomy = void 0;
var fBuildingRules_1 = require("../buildings/fBuildingRules");
var fModels_1 = require("../models/fModels");
var fFactionUtils_1 = require("./fFactionUtils");
var fLocationUtils_1 = require("./fLocationUtils");
function getSystemEconomy(star, game) {
    var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, star.ownerFactionId);
    var eco = __assign(__assign({}, star), { income: star.economy * fBuildingRules_1.buildingSpacePort(star) + fBuildingRules_1.buildingGalacticExchange(star, game.systems) + fBuildingRules_1.buildingCoreMine(star), profit: 0, expenses: 0, industryExpenses: star.industry < 3 ? 0 : Math.floor(star.industry / 2), welfareExpenses: star.welfare < 3 ? 0 : Math.floor(star.welfare / 2), defenseExpenses: star.defense, research: faction ? fFactionUtils_1.getSystemResearchPointGeneration(star, faction) : 0, industryMax: getStarIndustryMax(star, game), economyMax: getStarEconomyMax(star, game), defenseMax: getStarDefenceMax(star, game), welfareMax: getStarWelfareMax(star, game), buildingSlots: getSystemMaxBuildingSlots(star, game), buildingExpenses: star.buildings.reduce(function (tot, b) { return tot + b.maintenanceCost; }, 0) });
    eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses + eco.buildingExpenses + 1;
    eco.profit = eco.income - eco.expenses - 1;
    return fBuildingRules_1.buildingBioDome(fBuildingRules_1.buildingArcology(fBuildingRules_1.buildingIndustrySector(fBuildingRules_1.buildingFactoryAutomation(fBuildingRules_1.buildingRingWorld(eco)))));
}
exports.getSystemEconomy = getSystemEconomy;
function getStarIndustryMax(star, game) {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    var def = 5;
    if (star.keywords.includes(fModels_1.SystemKeyword.HOSTILE))
        def = 7;
    if (star.keywords.includes(fModels_1.SystemKeyword.MINERALRICH))
        def = 6;
    if (star.keywords.includes(fModels_1.SystemKeyword.MINERALRARE))
        def = 6;
    if (star.keywords.includes(fModels_1.SystemKeyword.GAIA))
        def = 4;
    if (star.keywords.includes(fModels_1.SystemKeyword.MINERALPOOR))
        def = 3;
    return def;
}
exports.getStarIndustryMax = getStarIndustryMax;
function getStarEconomyMax(star, game) {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    var def = 5;
    if (star.keywords.includes(fModels_1.SystemKeyword.ARTIFACTS))
        def = 7;
    if (star.keywords.includes(fModels_1.SystemKeyword.MINERALRARE))
        def = 6;
    if (star.keywords.includes(fModels_1.SystemKeyword.GAIA))
        def = 6;
    return def;
}
exports.getStarEconomyMax = getStarEconomyMax;
function getStarDefenceMax(star, game) {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    var def = 5;
    if (star.keywords.includes(fModels_1.SystemKeyword.HOSTILE))
        def = 7;
    return def;
}
exports.getStarDefenceMax = getStarDefenceMax;
function getStarWelfareMax(star, game) {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    var def = 5;
    if (star.keywords.includes(fModels_1.SystemKeyword.NATIVES))
        def = 6;
    if (star.keywords.includes(fModels_1.SystemKeyword.GAIA))
        def = 7;
    if (star.keywords.includes(fModels_1.SystemKeyword.HOSTILE))
        def = 1;
    return def;
}
exports.getStarWelfareMax = getStarWelfareMax;
function getSystemMaxBuildingSlots(star, game) {
    if (star.industry < 2)
        return 1;
    if (star.industry < 4)
        return 2;
    if (star.industry > 5)
        return 4;
    return 3;
}
exports.getSystemMaxBuildingSlots = getSystemMaxBuildingSlots;
function getSystemDefence(sm) {
    return sm.defense + fBuildingRules_1.buildingBunkers(sm);
}
exports.getSystemDefence = getSystemDefence;
function getSystemByCoordinates(game, coords) {
    // const game = joki.service.getState("GameService") as GameModel;
    return game.systems.find(function (sm) { return fLocationUtils_1.inSameLocation(sm.location, coords); });
}
exports.getSystemByCoordinates = getSystemByCoordinates;
