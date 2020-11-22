import { TECHIDS } from "../data/dataTechnology";
import { FactionModel } from "../models/Models";
import { ShipDesign, ShipUnit } from "../models/Units";

import { factionHasTechnology, techMultiplier } from "./techTools";


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
    
    function dmgMultiplier(techId: TECHIDS, mult: number, dmg: number|[number, number]): number|[number, number] {
        if(!factionHasTechnology(faction, techId)) {
            return dmg;
        }
            
        if(Array.isArray(dmg)) {
            return [Math.round(dmg[0] * mult), Math.round(dmg[1] * mult)];
        }
        return Math.round(dmg * mult);
    }

    return dmgMultiplier(TECHIDS.HeavyRounds3, 1.1, dmgMultiplier(TECHIDS.HeavyRounds2, 1.1, dmgMultiplier(TECHIDS.HeavyRounds1, 1.05, damage)));
}

export function techManouveringJets(faction: FactionModel, agility: number): number {

    if(factionHasTechnology(faction, TECHIDS.ManouveringJets3)){
        return Math.round(agility * 1.25);
    }

    if(factionHasTechnology(faction, TECHIDS.ManouveringJets2)){
        return Math.round(agility * 1.15);
    }

    if(factionHasTechnology(faction, TECHIDS.ManouveringJets1)){
        return Math.round(agility * 1.05);
    }

    return agility;
}


export function techFocusBeam(faction: FactionModel, damage: number|[number, number]): number|[number, number] {
    
    function dmgMultiplier(techId: TECHIDS, mult: number, dmg: number|[number, number]): number|[number, number] {
        if(!factionHasTechnology(faction, techId)) {
            return dmg;
        }
            
        if(Array.isArray(dmg)) {
            return [Math.round(dmg[0] * mult), Math.round(dmg[1] * mult)];
        }
        return Math.round(dmg * mult);
    }

    return dmgMultiplier(TECHIDS.FocusBeam3, 1.1, dmgMultiplier(TECHIDS.FocusBeam2, 1.1, dmgMultiplier(TECHIDS.FocusBeam1, 1.05, damage)));
}

export function techPowerShields(faction: FactionModel, ship: ShipDesign): number {
    if(!factionHasTechnology(faction, TECHIDS.PowerShields)) return 0;
    if(ship.shieldRegeneration === 0) return 0;
    return Math.round(ship.shieldRegeneration * 1.25);
}

export function techAutoRepairBots(faction: FactionModel, ship: ShipDesign): number {
    if(!factionHasTechnology(faction, TECHIDS.AutoRepBots1)) return 0;
    return Math.round(ship.hull/10);
}

export function techAutoRepairBots2(faction: FactionModel, ship: ShipDesign): number {
    if(!factionHasTechnology(faction, TECHIDS.AutoRepBots2)) return 0;
    return Math.round(ship.sizeIndicator*3);
}

