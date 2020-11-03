import { SystemModel } from "../models/Models";
import { getFactionById, getSystemResearchPointGeneration } from "./factionUtils";


export interface SystemEconomy extends SystemModel {
    income: number;
    expenses: number;
    industryExpenses: number;
    welfareExpenses: number;
    defenseExpenses: number;
    profit: number;
    research: number;
}

export function getSystemEconomy(star: SystemModel): SystemEconomy {
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
    };
    
    eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses;
    eco.profit = eco.income - eco.expenses - 1;

    return eco;

}