import { SYSTEMBONUS } from "../configs";
import { TECHIDS } from "../data/dataTechnology";
import { FactionModel, GameModel, SystemKeyword, SystemModel } from "../models/Models";
import { SystemEconomy } from "../utils/systemUtils";
import { factionHasTechnology } from "./techTools";



export function techMarketing(faction: FactionModel, game: GameModel): number {
    if(!factionHasTechnology(faction, TECHIDS.Marketing)) return 0;

    const totEco = game.systems.reduce((tot: number, sm: SystemModel) => {
        if(sm.ownerFactionId === faction.id) {
            return tot + sm.economy;
        }
        return tot;
    }, 0);

    return Math.floor(totEco/5);
}

export function techInitEcoBoost(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.InitEcoBoost)) return 0;
    return 0;
}

export function techMerchantGuild(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.MerchGuilds)) return 0;
    return 2;
}

export function techMineralPros(faction: FactionModel, star: SystemModel): number {
    if(!factionHasTechnology(faction, TECHIDS.MineralPros)) return 0;
    if(!star.keywords.includes(SystemKeyword.MINERALRARE) && !star.keywords.includes(SystemKeyword.MINERALRICH)) {
        return 0;
    }
    return 1;
}

export function techAlternativePros(faction: FactionModel, star: SystemModel): number {
    if(!factionHasTechnology(faction, TECHIDS.AlterPros)) return 0;
    if(!star.keywords.includes(SystemKeyword.MINERALPOOR)) {
        return 0;
    } 
    return 1;
}


export function techDecisionEngine(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.Marketing)) return 10;
    return 7;
}

export function techHigherEducation(faction: FactionModel): number[] {
    if(!factionHasTechnology(faction, TECHIDS.HigherEdu)) return [0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4];
    return [0, 1, 2, 2, 1, 0, 0, -1, -2, -3, -3, -4, -5];
}

