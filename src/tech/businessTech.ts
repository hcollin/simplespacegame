import { TECHIDS } from "../data/dataTechnology";
import { FactionModel, GameModel, SystemKeyword, SystemModel } from "../models/Models";
import { factionHasTechnology } from "./techTools";

export function techMarketing(faction: FactionModel, game: GameModel): number {
    if (!factionHasTechnology(faction, TECHIDS.Marketing)) return 0;

    const totEco = game.systems.reduce((tot: number, sm: SystemModel) => {
        if (sm.ownerFactionId === faction.id) {
            return tot + sm.economy;
        }
        return tot;
    }, 0);

    return Math.floor(totEco / 5);
}

export function techInitEcoBoost(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.InitEcoBoost)) return 0;
    return 0;
}

export function techMerchantGuild(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.MerchGuilds)) return 0;
    return 2;
}

export function techMineralPros(faction: FactionModel, star: SystemModel): number {
    if (!factionHasTechnology(faction, TECHIDS.MineralPros)) return 0;
    if (!star.keywords.includes(SystemKeyword.MINERALRARE) && !star.keywords.includes(SystemKeyword.MINERALRICH)) {
        return 0;
    }
    return 1;
}

export function techAlternativePros(faction: FactionModel, star: SystemModel): number {
    if (!factionHasTechnology(faction, TECHIDS.AlterPros)) return 0;
    if (!star.keywords.includes(SystemKeyword.MINERALPOOR)) {
        return 0;
    }
    return 1;
}

export function techDecisionEngine(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.Marketing)) return 10;
    return 7;
}

export function techHigherEducation(faction: FactionModel): number[] {
    if (!factionHasTechnology(faction, TECHIDS.HigherEdu)) return [0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4];
    return [0, 1, 2, 2, 1, 0, 0, -1, -2, -3, -3, -4, -5];
}

export function techGalacticSenate(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.GalacticSen)) return 0;
    return 1;
}

export function techAdaptability(faction: FactionModel, star: SystemModel, current: number): number {
    if (!factionHasTechnology(faction, TECHIDS.Adaptability)) return current;
    if (!star.keywords.includes(SystemKeyword.HOSTILE)) return current;
    if (current > 3) return current;
    return 3;
}

export function techEfficientBureaucracy(faction: FactionModel, cost: number): number {
    if (!factionHasTechnology(faction, TECHIDS.EfficientBur)) return cost;

    return cost > 1 ? cost - 1 : cost;
}

export function techSpaceDock(faction: FactionModel, star: SystemModel): number {
    if (!factionHasTechnology(faction, TECHIDS.SpaceDock)) return 1;
    if(star.industry < 5) return 1;
    return 2;
}

export function techUndergroundConstruction(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.Ugconstruc)) return 0;
    return 1;
}

export function techLevitationBuildings(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.LevitatBuild)) return 0;
    return 1;
}

export function techExpansionist(faction: FactionModel, stars: SystemModel[]): number {
    if (!factionHasTechnology(faction, TECHIDS.Expansionist)) return 0;
    return Math.floor(
        stars.reduce((tot: number, sm: SystemModel) => {
            if (sm.ownerFactionId === faction.id) {
                return tot + 1;
            }
            return tot;
        }, 0) / 7
    );
}


export function techCapitalist(faction: FactionModel, stars: SystemModel[]): number {
    if (!factionHasTechnology(faction, TECHIDS.Expansionist)) return 0;
    return Math.floor(
        stars.reduce((tot: number, sm: SystemModel) => {
            if (sm.ownerFactionId === faction.id) {
                return tot + 1;
            }
            return tot;
        }, 0) / 7
    ) * 5;
}


export function techScientist(faction: FactionModel, stars: SystemModel[]): number {
    if (!factionHasTechnology(faction, TECHIDS.Expansionist)) return 0;
    return Math.floor(
        stars.reduce((tot: number, sm: SystemModel) => {
            if (sm.ownerFactionId === faction.id) {
                return tot + 1;
            }
            return tot;
        }, 0) / 7
    ) * 3;
}

export function techDysonSphere(faction: FactionModel): boolean {
    return factionHasTechnology(faction, TECHIDS.DysonShpe);
}
