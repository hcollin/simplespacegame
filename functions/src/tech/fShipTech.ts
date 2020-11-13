import { TECHIDS } from "../data/fDataTechnology";
import { FactionModel } from "../models/fModels";
import { ShipWeapon } from "../models/fUnits";

import { factionHasTechnology } from "./fTechTools";


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
    if(!factionHasTechnology(faction, TECHIDS.TargetingComp1)) return 0;
    return 5;
}

export function techTargetingComputerTwo(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.TargetingComp2)) return 0;
    return 5;
}

export function techTargetingComputerThree(faction: FactionModel): number {
    if(!factionHasTechnology(faction, TECHIDS.TargetingComp3)) return 0;
    return 10;
}

export function techHeavyRounds(faction: FactionModel, damage: number|[number, number]): number|[number, number] {
    if(!factionHasTechnology(faction, TECHIDS.HeavyRounds)) return damage;
    if(Array.isArray(damage)) {
        return [Math.round(damage[0] * 1.1), Math.round(damage[1] * 1.1)];
    }
    return Math.round(damage * 1.1);
}

export function techEvasionEngine(faction: FactionModel, agility: number): number {
    if(!factionHasTechnology(faction, TECHIDS.EvasionEngine)) return agility;
    return Math.round(agility * 1.1);
}

export function techTimeslipPrediction(faction: FactionModel, agility: number): number {
    if(!factionHasTechnology(faction, TECHIDS.PredEvasion)) return agility;
    return Math.round(agility + 10);
}