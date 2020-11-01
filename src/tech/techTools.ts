import { TECHIDS } from "../data/dataTechnology";
import { FactionModel } from "../models/Models";


export function factionHasTechnology(faction: FactionModel, techId: TECHIDS): boolean {
    return faction.technology.includes(techId);
}