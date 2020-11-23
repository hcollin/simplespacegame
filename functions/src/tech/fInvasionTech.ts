import { TECHIDS } from "../data/fDataTechnology";
import { FactionModel } from "../models/fModels";
import { factionHasTechnology } from "./fTechTools";

export function techAutoDefenses(faction: FactionModel): number {
    if(factionHasTechnology(faction, TECHIDS.AutoDef3)) return 5;
    if(factionHasTechnology(faction, TECHIDS.AutoDef2)) return 3;
    if(factionHasTechnology(faction, TECHIDS.AutoDef1)) return 1;
    return 0;
}

export function techDroidDefences(faction: FactionModel): number {
    if(factionHasTechnology(faction, TECHIDS.DriodDef)) return 2;
    return 1;
}


export function techSpaceMarine(faction: FactionModel): number {
    if(factionHasTechnology(faction, TECHIDS.SpaceMarine2)) return 3;
    if(factionHasTechnology(faction, TECHIDS.SpaceMarine1)) return 1;
    return 0;
}

export function techTerminatorTroops(faction: FactionModel, troops: number): number {
    if(!factionHasTechnology(faction, TECHIDS.TermiTroops)) return troops;
    return Math.round(troops*1.5);
}


