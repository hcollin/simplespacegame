
import { Building } from "../models/Buildings";
import { Trade } from "../models/Communication";
import { FactionModel, FactionTechSetting, GameModel, SystemModel } from "../models/Models";
import { ShipUnit } from "../models/Units";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { techDecisionEngine, techHigherEducation, techMarketing } from "../tech/businessTech";

interface FactionValues {
    maxCommands: number;
    totalEconomy: number;
    totalWelfare: number;
    expenses: number;
    income: number;
    victoryPoints: number;
    unitExpenses: number;
    unitCount: number;
    systemExpenses: number;
    systemCount: number;
    systemIncome: number,
    trade: number;
}

export function factionValues(game: GameModel, factionId: string): FactionValues {
    const values: FactionValues = {
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
        trade: 0,
    };
    const faction = getFactionFromArrayById(game.factions, factionId)
    if (!faction) {
        throw new Error("Invalid Faction");
    }

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            values.totalEconomy += star.economy;
            values.totalWelfare += star.welfare;
            values.systemIncome += star.economy;
            values.systemCount++;
        }
    });

    values.unitExpenses = game.units.reduce((sum: number, um: ShipUnit) => {
        if (um.factionId === factionId) {
            return sum + unitExpenses(um);
        }
        return sum;
    }, 0);
    values.unitCount = game.units.filter((um: ShipUnit) => um.factionId === factionId).length;

    values.expenses = expensesCalculator(game, factionId);

    values.systemExpenses = game.systems.reduce((sum: number, sm: SystemModel) => {
        if (sm.ownerFactionId === factionId) {
            sum += systemExpenses(sm);
        }
        return sum;

    }, 0);

    values.trade = game.trades.reduce((sum: number, t: Trade) => {
        if (t.to === factionId) {
            return sum + t.money;
        }
        if (t.from === factionId) {
            return sum - t.money;
        }
        return sum;
    }, 0)

    values.income = values.totalEconomy + values.trade - values.expenses + techMarketing(faction, game);

    values.maxCommands = commandCountCalculator(game, factionId);

    

    return values;
}

/**
 * This function calculates the total expenses for the faction.
 *
 * Each unit costs 1 per turn. Welfare and Industry also increase expenses when they go over 4 on a planet.
 *
 * @param game
 * @param factionId
 */
export function expensesCalculator(game: GameModel, factionId: string): number {
    let expenses = 0;

    game.units.forEach((unit: ShipUnit) => {
        if (unit.factionId === factionId) {
            expenses += unitExpenses(unit);
        }
    });

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            expenses += systemExpenses(star);
        }
    });

    return expenses;
}

/**
 * The amount of commands the player can give each turn depends on the welfare of the planets.
 *
 * The minimum amount of commands is 3.
 *
 * @param game
 * @param factionId
 */
export function commandCountCalculator(game: GameModel, factionId: string): number {
    let totalWelfare = 0;
    let bonusCommands = 0;

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            totalWelfare += star.welfare;

            // 1 bonus command per 5 welfare in this system
            bonusCommands += Math.floor(star.welfare / 5);
        }
    });
    const f = getFactionFromArrayById(game.factions, factionId);
    if (!f) throw new Error(`INvalid factionId${factionId}`);
    return getWelfareCommands(f, totalWelfare) + bonusCommands;
}

export function getWelfareCommands(faction: FactionModel, welfarePointTotal: number): number {

    return 3 + Math.floor(welfarePointTotal / techDecisionEngine(faction));
}

export function unitExpenses(um: ShipUnit): number {
    return um.cost >= 3 ? Math.floor(um.cost / 3) : 1;
}

export function systemExpenses(sm: SystemModel): number {
    const indExp = sm.industry < 3 ? 0 : Math.floor(sm.industry / 2);
    const welExp = sm.welfare < 3 ? 0 : Math.floor(sm.welfare / 2);
    const defExp = sm.defense;
    const buildingExpenses = sm.buildings.reduce((tot: number, b: Building) => tot + b.maintenanceCost, 0);
    return indExp + welExp + defExp + buildingExpenses + 1;
}

export function researchPointGenerationCalculator(game: GameModel, faction: FactionModel): number {

    // const game = joki.service.getState("GameService") as GameModel;

    const points = game.systems.reduce((sum: number, sm: SystemModel) => {
        if (sm.ownerFactionId === faction.id) {
            sum += getSystemResearchPointGeneration(sm, faction);
        }
        return sum;
    }, 0);
    return points;
}

export function getSystemResearchPointGeneration(sm: SystemModel, faction: FactionModel): number {

    const welfareCurve = techHigherEducation(faction);
    let sum = 0;
    sum += Math.floor((sm.industry + sm.defense) / 3);
    sum += Math.floor(sm.economy / 4);
    sum += sm.welfare < welfareCurve.length ? welfareCurve[sm.welfare] : -5;
    return sum;
}

export function researchPointDistribution(totalPoints: number, faction: FactionModel): number[] {

    let points: number[] = []
    const totalFocusPoints = faction.technologyFields.reduce((tot: number, tech: FactionTechSetting) => tot + tech.priority, 0);

    const partPoint = totalFocusPoints > 0 ? totalPoints / totalFocusPoints : 0;
    // const techDistribution = [0.50, 0.50, 0., 0.10, 0];
    let highestFieldIndex = -1;
    let highestFieldValue = -1;
    faction.technologyFields.forEach((tech: FactionTechSetting, index: number) => {

        const curSum = points.reduce((tot: number, cur: number) => tot + cur, 0);
        const remaining = totalPoints - curSum;
        let newVal = Math.round(partPoint * tech.priority);
        if (newVal > remaining) {
            newVal = remaining;
        }
        if (tech.priority > highestFieldValue) {
            highestFieldValue = tech.priority;
            highestFieldIndex = index;
        }
        points.push(Math.round(newVal));
    });

    const curSum = points.reduce((tot: number, cur: number) => tot + cur, 0);
    if (curSum < totalPoints) {
        points[highestFieldIndex] += (totalPoints - curSum);
    }

    return points;
}


/**
 * Calculate the score for faction
 * 
 * @param factionId 
 */
export function getFactionScore(game: GameModel, factionId: string): number {
    let score = 0;

    game.systems.forEach((sm: SystemModel) => {

        if (sm.ownerFactionId === factionId) {
            score += 3;
            score += Math.round((sm.industry + sm.economy + sm.defense + sm.welfare) / 4);
            const bScore = sm.buildings.reduce((tot: number, b: Building) => {
                return tot + b.score;
            }, 0);

            score += bScore;
        }
    });

    game.units.forEach((u: ShipUnit) => {
        if (u.factionId === factionId) {
            score += Math.round(u.cost / 3);
        }
    });

    const faction = getFactionFromArrayById(game.factions, factionId);
    if (!faction) throw new Error(`Invalid faction id ${factionId}`);
    score += faction.technology.length * 2;

    return score;
}