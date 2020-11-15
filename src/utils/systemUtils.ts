import { buildingArcology } from "../buildings/buildingRules";
import { GameModel, SystemKeyword, SystemModel } from "../models/Models";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
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
    const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);

    const eco: SystemEconomy = {
        ...star,
        income: star.economy,
        profit: 0,
        expenses: 0,
        industryExpenses: star.industry < 3 ? 0 : Math.floor(star.industry / 2),
        welfareExpenses: star.welfare < 3 ? 0 : Math.floor(star.welfare / 2),
        defenseExpenses: star.defense,
        research: faction ? getSystemResearchPointGeneration(star, faction) : 0,
        industryMax: getStarIndustryMax(star, game),
        economyMax: getStarEconomyMax(star, game),
        defenseMax: getStarDefenceMax(star, game),
        welfareMax: getStarWelfareMax(star, game),
    };

    eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses;
    eco.profit = eco.income - eco.expenses - 1;


    return buildingArcology(eco);

}

export function getStarIndustryMax(star: SystemModel, game: GameModel): number {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    let def = 5;
    if(star.keywords.includes(SystemKeyword.HOSTILE)) def = 7;
    if(star.keywords.includes(SystemKeyword.MINERALRICH)) def = 6;
    if(star.keywords.includes(SystemKeyword.MINERALRARE)) def = 6;
    if(star.keywords.includes(SystemKeyword.GAIA)) def = 4;
    if(star.keywords.includes(SystemKeyword.MINERALPOOR)) def = 3;
    return def;
}

export function getStarEconomyMax(star: SystemModel, game: GameModel): number {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    let def = 5;    
    if(star.keywords.includes(SystemKeyword.ARTIFACTS)) def = 7;
    if(star.keywords.includes(SystemKeyword.MINERALRARE)) def = 6;
    if(star.keywords.includes(SystemKeyword.GAIA)) def = 6;    
    
    return def;
}

export function getStarDefenceMax(star: SystemModel, game: GameModel): number {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    let def = 5;    
    if(star.keywords.includes(SystemKeyword.HOSTILE)) def = 7;
    return def;
}

export function getStarWelfareMax(star: SystemModel, game: GameModel): number {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    let def = 5;    
    if(star.keywords.includes(SystemKeyword.NATIVES)) def = 6;
    if(star.keywords.includes(SystemKeyword.GAIA)) def = 7;
    if(star.keywords.includes(SystemKeyword.HOSTILE)) def = 1;
    return def;
}