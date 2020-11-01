import { TECHIDS } from "../data/dataTechnology";
import { FactionModel } from "../models/Models";

import { factionHasTechnology } from "./techTools";


/**
 * Technology function for IonEngines
 */
export function techIonEngines(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.IonEngines)) return 0;
    return 1;
}

/**
 * Returns the adjustment for speed for units for factions with Warp Engines
 * @param 
 */
export function techWarpEngines(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.WarpEngines)) return 0;
    return 3;
}


export function techTargetingComputerOne(faction: FactionModel): number {

    return 0;
}