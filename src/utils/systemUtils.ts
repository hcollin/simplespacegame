import { GameModel, SystemModel } from "../models/Models";
import { getFactionById } from "./factionJokiUtils";
import { getSystemResearchPointGeneration } from "./factionUtils";


export interface SystemEconomy extends SystemModel {
    income: number;
    expenses: number;
    industryExpenses: number;
    welfareExpenses: number;
    defenseExpenses: number;
    profit: number;
    research: number;
    industryMax: number;
    economyMax: number;
    defenseMax: number;
    welfareMax: number;
}

export function getSystemEconomy(star: SystemModel, game: GameModel): SystemEconomy {
    const faction = getFactionById(star.ownerFactionId);
    const eco: SystemEconomy = {
        ...star,
        income: star.economy,
        profit: 0,
        expenses: 0,
        industryExpenses:star.industry < 3 ? 0 : Math.floor(star.industry / 2),
        welfareExpenses:star.welfare < 3 ? 0 : Math.floor(star.welfare / 2),
        defenseExpenses: star.defense,  
        research: getSystemResearchPointGeneration(star,faction),
        industryMax: 5,
        economyMax: 5,
        defenseMax: 5,
        welfareMax: 5,
    };
    
    eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses;
    eco.profit = eco.income - eco.expenses - 1;

    return eco;

}

