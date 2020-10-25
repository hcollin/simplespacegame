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
}

export function factionValues(game: GameModel, factionId: string): FactionValues {

    const values: FactionValues = {
        maxCommands: 0,
        totalEconomy: 0,
        totalWelfare: 0,
        expenses: 0,
        income: 0,
        victoryPoints: 0,
    };

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            values.totalEconomy += star.economy;
            values.totalWelfare += star.welfare;
        }
    });

    values.expenses = expensesCalculator(game, factionId);
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
            expenses++;
        }
    });

    game.systems.forEach((star: SystemModel) => {
        if (star.ownerFactionId === factionId) {
            const indExp = star.industry < 4 ? 0 : Math.floor(star.industry / 2);
            const welExp = star.welfare < 5 ? 0 : Math.floor(star.welfare / 2);
            const defExp = star.defense;
            expenses = expenses + indExp + welExp + defExp + 1;
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