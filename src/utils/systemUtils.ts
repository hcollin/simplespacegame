import { SystemModel } from "../models/Models";


interface SystemEconomy {
    income: number;
    expenses: number;
    industryExpenses: number;
    welfareExpenses: number;
    defenseExpenses: number;
    profit: number;
}



export function getSystemEconomy(star: SystemModel):SystemEconomy {

    const eco: SystemEconomy = {
        income: star.economy,
        profit: 0,
        expenses: 0,
        industryExpenses:star.industry < 3 ? 0 : Math.floor(star.industry / 2),
        welfareExpenses:star.welfare < 3 ? 0 : Math.floor(star.welfare / 2),
        defenseExpenses: star.defense,  
    }
    
    eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses;
    eco.profit = eco.income - eco.expenses;

    return eco;

}