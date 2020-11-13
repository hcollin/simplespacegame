import { TECHIDS } from "../data/fDataTechnology";
import { FactionModel } from "../models/fModels";


export function factionHasTechnology(faction: FactionModel, techId: TECHIDS): boolean {
    return faction.technology.includes(techId);
}