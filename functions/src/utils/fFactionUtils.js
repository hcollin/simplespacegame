"use strict";
exports.__esModule = true;
exports.getFactionScore = exports.researchPointDistribution = exports.getSystemResearchPointGeneration = exports.researchPointGenerationCalculator = exports.systemExpenses = exports.unitExpenses = exports.getWelfareCommands = exports.commandCountCalculator = exports.expensesCalculator = exports.factionValues = exports.getFactionFromArrayById = void 0;
var fBuildingRules_1 = require("../buildings/fBuildingRules");
var fBusinessTech_1 = require("../tech/fBusinessTech");
function getFactionFromArrayById(factions, id) {
    return factions.find(function (fm) { return fm.id === id; });
}
exports.getFactionFromArrayById = getFactionFromArrayById;
function factionValues(game, factionId) {
    var values = {
        maxCommands: 0,
        totalEconomy: 0,
        totalWelfare: 0,
        expenses: 0,
        income: 0,
        victoryPoints: 0,
        unitExpenses: 0,
        unitCount: 0,
        systemExpenses: 0,
        systemCount: 0,
        systemIncome: 0,
        trade: 0
    };
    var faction = getFactionFromArrayById(game.factions, factionId);
    if (!faction) {
        throw new Error("Invalid Faction");
    }
    game.systems.forEach(function (star) {
        if (star.ownerFactionId === factionId) {
            values.totalEconomy += star.economy;
            values.totalWelfare += star.welfare;
            values.systemIncome += star.economy;
            values.systemCount++;
        }
    });
    values.unitExpenses = game.units.reduce(function (sum, um) {
        if (um.factionId === factionId) {
            return sum + unitExpenses(um);
        }
        return sum;
    }, 0);
    values.unitCount = game.units.filter(function (um) { return um.factionId === factionId; }).length;
    values.expenses = expensesCalculator(game, factionId);
    values.systemExpenses = game.systems.reduce(function (sum, sm) {
        if (sm.ownerFactionId === factionId) {
            sum += systemExpenses(sm);
        }
        return sum;
    }, 0);
    values.trade = game.trades.reduce(function (sum, t) {
        if (t.to === factionId) {
            return sum + t.money;
        }
        if (t.from === factionId) {
            return sum - t.money;
        }
        return sum;
    }, 0);
    values.income = values.totalEconomy + values.trade - values.expenses + fBusinessTech_1.techMarketing(faction, game);
    values.maxCommands = commandCountCalculator(game, factionId);
    return values;
}
exports.factionValues = factionValues;
/**
 * This function calculates the total expenses for the faction.
 *
 * Each unit costs 1 per turn. Welfare and Industry also increase expenses when they go over 4 on a planet.
 *
 * @param game
 * @param factionId
 */
function expensesCalculator(game, factionId) {
    var expenses = 0;
    game.units.forEach(function (unit) {
        if (unit.factionId === factionId) {
            expenses += unitExpenses(unit);
        }
    });
    game.systems.forEach(function (star) {
        if (star.ownerFactionId === factionId) {
            expenses += systemExpenses(star);
        }
    });
    return expenses;
}
exports.expensesCalculator = expensesCalculator;
/**
 * The amount of commands the player can give each turn depends on the welfare of the planets.
 *
 * The minimum amount of commands is 3.
 *
 * @param game
 * @param factionId
 */
function commandCountCalculator(game, factionId) {
    var totalWelfare = 0;
    var bonusCommands = 0;
    game.systems.forEach(function (star) {
        if (star.ownerFactionId === factionId) {
            totalWelfare += star.welfare;
            // 1 bonus command per 5 welfare in this system
            bonusCommands += Math.floor(star.welfare / 5);
            bonusCommands += fBuildingRules_1.buildingCGaiaProject(star, "COMMAND");
            bonusCommands += fBuildingRules_1.buildingCommandCenter(star);
        }
    });
    var f = getFactionFromArrayById(game.factions, factionId);
    if (!f)
        throw new Error("Invalid factionId" + factionId);
    return getWelfareCommands(f, totalWelfare) + bonusCommands;
}
exports.commandCountCalculator = commandCountCalculator;
function getWelfareCommands(faction, welfarePointTotal) {
    return 3 + Math.floor(welfarePointTotal / fBusinessTech_1.techDecisionEngine(faction));
}
exports.getWelfareCommands = getWelfareCommands;
function unitExpenses(um) {
    return um.cost >= 3 ? Math.floor(um.cost / 3) : 1;
}
exports.unitExpenses = unitExpenses;
function systemExpenses(sm) {
    var indExp = sm.industry < 3 ? 0 : Math.floor(sm.industry / 2);
    var welExp = sm.welfare < 3 ? 0 : Math.floor(sm.welfare / 2);
    var defExp = sm.defense;
    var buildingExpenses = sm.buildings.reduce(function (tot, b) { return tot + b.maintenanceCost; }, 0);
    return indExp + welExp + defExp + buildingExpenses + 1;
}
exports.systemExpenses = systemExpenses;
function researchPointGenerationCalculator(game, faction) {
    // const game = joki.service.getState("GameService") as GameModel;
    var points = game.systems.reduce(function (sum, sm) {
        if (sm.ownerFactionId === faction.id) {
            sum += getSystemResearchPointGeneration(sm, faction);
        }
        return sum;
    }, 0);
    return points;
}
exports.researchPointGenerationCalculator = researchPointGenerationCalculator;
function getSystemResearchPointGeneration(sm, faction) {
    var welfareCurve = fBusinessTech_1.techHigherEducation(faction);
    var sum = 0;
    sum += Math.floor((sm.industry + sm.defense) / 3);
    sum += Math.floor(sm.economy / 4);
    sum += sm.welfare < welfareCurve.length ? welfareCurve[sm.welfare] : -5;
    sum += fBuildingRules_1.buildingCGaiaProject(sm, "RESEARCH") + fBuildingRules_1.buildingUniversity(sm);
    return sum;
}
exports.getSystemResearchPointGeneration = getSystemResearchPointGeneration;
function researchPointDistribution(totalPoints, faction) {
    var points = [];
    var totalFocusPoints = faction.technologyFields.reduce(function (tot, tech) { return tot + tech.priority; }, 0);
    var partPoint = totalFocusPoints > 0 ? totalPoints / totalFocusPoints : 0;
    // const techDistribution = [0.50, 0.50, 0., 0.10, 0];
    var highestFieldIndex = -1;
    var highestFieldValue = -1;
    faction.technologyFields.forEach(function (tech, index) {
        var curSum = points.reduce(function (tot, cur) { return tot + cur; }, 0);
        var remaining = totalPoints - curSum;
        var newVal = Math.round(partPoint * tech.priority);
        if (newVal > remaining) {
            newVal = remaining;
        }
        if (tech.priority > highestFieldValue) {
            highestFieldValue = tech.priority;
            highestFieldIndex = index;
        }
        points.push(Math.round(newVal));
    });
    var curSum = points.reduce(function (tot, cur) { return tot + cur; }, 0);
    if (curSum < totalPoints) {
        points[highestFieldIndex] += (totalPoints - curSum);
    }
    return points;
}
exports.researchPointDistribution = researchPointDistribution;
/**
 * Calculate the score for faction
 *
 * @param factionId
 */
function getFactionScore(game, factionId) {
    var score = 0;
    game.systems.forEach(function (sm) {
        if (sm.ownerFactionId === factionId) {
            score += 3;
            score += Math.round((sm.industry + sm.economy + sm.defense + sm.welfare) / 4);
            var bScore = sm.buildings.reduce(function (tot, b) {
                return tot + b.score;
            }, 0);
            score += bScore;
        }
    });
    game.units.forEach(function (u) {
        if (u.factionId === factionId) {
            score += Math.round(u.cost / 3);
        }
    });
    var faction = getFactionFromArrayById(game.factions, factionId);
    if (!faction)
        throw new Error("Invalid faction id " + factionId);
    score += faction.technology.length * 2;
    score += fBuildingRules_1.buildingGalacticSenate(game, faction);
    // Add technology scores from base research techs
    return score;
}
exports.getFactionScore = getFactionScore;
