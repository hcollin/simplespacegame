import { TECHIDS } from "../data/fDataTechnology";
import { FactionModel, GameModel, SystemModel } from "../models/fModels";
import { factionHasTechnology } from "./fTechTools";



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


export function techDecisionEngine(faction: FactionModel): number {
    if (!factionHasTechnology(faction, TECHIDS.Marketing)) return 10;
    return 7;
}

export function techHigherEducation(faction: FactionModel): number[] {
    if(!factionHasTechnology(faction, TECHIDS.HigherEdu)) return [0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4];
    return [0, 1, 2, 2, 1, 0, 0, -1, -2, -3, -3, -4, -5];
}