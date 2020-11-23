import { TECHIDS } from "../data/dataTechnology";
import { FactionModel } from "../models/Models";


export function factionHasTechnology(faction: FactionModel, techId: TECHIDS): boolean {
    return faction.technology.includes(techId);
}

export function techMultiplier(techId: TECHIDS, faction: FactionModel, mult: number, agi: number): number {
    if(!factionHasTechnology(faction, techId)) return agi;
    return agi * mult;
}