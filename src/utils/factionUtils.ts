import { joki } from "jokits-react";
import { FactionModel, GameModel, SystemModel, UnitModel } from "../models/Models";

export function getFactionById(fid: string): FactionModel {
    const game = joki.service.getState("GameService") as GameModel;
    const f = game.factions.find((f: FactionModel) => f.id === fid);
    if (!f) {
        throw new Error(`Invalid Faction id ${fid}`);
    }
    return f;
}

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
    };

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            values.totalEconomy += star.economy;
            values.totalWelfare += star.welfare;
            values.systemIncome += star.economy;
            values.systemCount++;

        }
    });

    values.unitExpenses = game.units.reduce((sum: number, um: UnitModel) => {
        if(um.factionId === factionId) {
            return sum + unitExpenses(um);
        }
        return sum;
    },0 );
    values.unitCount = game.units.filter((um: UnitModel) => um.factionId === factionId).length;

    values.expenses = expensesCalculator(game, factionId);
    
    values.systemExpenses = game.systems.reduce((sum: number, sm: SystemModel) => {
        if(sm.ownerFactionId === factionId) {
            sum += systemExpenses(sm);
        }
        return sum;

    }, 0)
    values.income = values.totalEconomy - values.expenses;


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

    game.units.forEach((unit: UnitModel) => {
        if (unit.factionId === factionId) {
            expenses += unitExpenses(unit);
        }
    });

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            expenses = systemExpenses(star);
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

    return 3 + Math.floor(totalWelfare / 10) + bonusCommands;
}


export function unitExpenses(um: UnitModel): number {
    return um.cost >= 3 ? Math.floor(um.cost/3) : 1;
}

export function systemExpenses(sm: SystemModel): number {
    const indExp = sm.industry < 3 ? 0 : Math.floor(sm.industry / 2);
    const welExp = sm.welfare < 3 ? 0 : Math.floor(sm.welfare / 2);
    const defExp = sm.defense;
    return indExp + welExp + defExp + 1;
}