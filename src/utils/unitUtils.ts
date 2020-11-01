import { TECHIDS } from "../data/dataTechnology";
import { CombatEvent, UnitModel } from "../models/Models";
import { techIonEngines, techTargetingComputerOne, techWarpEngines } from "../tech/shipTech";
import { factionHasTechnology } from "../tech/techTools";
import { getFactionById } from "./factionUtils";
import { rnd } from "./randUtils";



export function getUnitSpeed(um: UnitModel): number {
    if(um.speed === 0 ) return 0;
    const faction = getFactionById(um.factionId);
    return um.speed + techIonEngines(faction) + techWarpEngines(faction);
}

/**
 * Get the number hits this unit produces this combat round
 * @param um 
 */
export function combatRoll(um: UnitModel, combat: CombatEvent): number {
    const faction = getFactionById(um.factionId);

    const rollBonus = techTargetingComputerOne(faction);
    let hits = 0;
    let success = 0;
    const rolls: number[] = [];
    for(let i = 0; i < um.weapons; i++) {
        const roll = rnd(1, 10) + rollBonus;
        rolls.push(roll);
        if(roll > 5) {
            success++;
            hits += getCombatDamage(um);
        }
    }

    combat.log.push(`${faction.name} ${um.name} rolls ${rolls.join(", ")} dealing ${hits} damage`);

    return hits;
}

export function getCombatDamage(um: UnitModel): number {
    return 1;
}


export function chooseTargetForDamage(shooterId: string, units: UnitModel[], combat: CombatEvent): UnitModel|null {
    return units.reduce((targ: UnitModel|null, um: UnitModel) => {
        
        if(um.factionId === shooterId) return targ;

        if(targ === null) return um;

        if((um.hull - um.damage ) < (targ.hull - targ.damage)) {
            return um;
        }

        return targ;
    }, null);
}

export function dealDamageToTarget(target: UnitModel, maxDamage: number, combat: CombatEvent): UnitModel {
    if(target.damage < target.hull) {
        target.damage++;
    }
    return target;
}



