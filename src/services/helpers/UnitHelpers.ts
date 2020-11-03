import { joki } from "jokits-react";
import { v4 } from "uuid";
import DATASHIPS, { shipNameGenerator } from "../../data/dataShips";
import { Command, CommandType, FleetCommand } from "../../models/Commands";
import { Coordinates, SystemModel, SpaceCombat, FactionModel } from "../../models/Models";
import { ShipDesign, ShipUnit, ShipWeapon } from "../../models/Units";
import { getFactionById } from "../../utils/factionUtils";
import { rnd } from "../../utils/randUtils";
import { getFactionAdjustedUnit, getFactionAdjustedWeapon } from "../../utils/unitUtils";


export function unitIsMoving(unit: ShipUnit): boolean {

    const commands = joki.service.getState("CommandService") as Command[];

    return commands.find((cmd: Command) => {
        if (cmd.type === CommandType.FleetMove) {
            const fcmd = cmd as FleetCommand;
            return fcmd.unitIds.includes(unit.id);
        }
        return false;
    }) !== undefined;
}

/**
 * Create a ShipUnit from ShipDesign
 * 
 * @param design 
 * @param factionId 
 * @param location 
 */
export function createShipFromDesign(design: ShipDesign, factionId: string, location: Coordinates): ShipUnit {
    const ship: ShipUnit = {
        ...design,
        id: v4(),
        damage: 0,
        morale: 100,
        shields: design.shieldsMax,
        location: location,
        factionId: factionId,
        experience: 0,
        name: shipNameGenerator(design.type),
    };

    return ship;
}


export function getDesignByName(name: string): ShipDesign {
    const sd = DATASHIPS.find((s: ShipDesign) => s.name === name);
    if(!sd) {
        throw new Error(`Unknown ship desgin ${name}`);
    }
    return sd;
}

export function spaceCombatMain(units: ShipUnit[], system: SystemModel | null): SpaceCombat {

    let combat: SpaceCombat = {
        units: [...units],
        system: system,
        round: 0,
        log: [],
        done: false,
    }

    combat.log.push(`Space combat starts`);
    // PRE COMBAT
    // TODO


    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;
        combat.log.push(`ROUND ${combat.round}`);

        combat = spaceCombatAttacks(combat);
        combat = spaceCombatDamageResolve(combat);
        combat = spaceCombatMorale(combat);


        combat = spaceCombatRoundCleanUp(combat);

        // if(combat.round >= 10) {
        //     combat.done = true;
        // }
    }


    // POST COMBAT

    combat.units = combat.units.map((su: ShipUnit) => {
        su.shields = su.shieldsMax;
        su.experience += combat.round;
        return su;
    })

    combat.log.push(`Space combat ends`);
    return combat;
}

export function spaceCombatAttacks(origCombat: SpaceCombat): SpaceCombat {

    const attackers = [...origCombat.units];

    let combat = { ...origCombat };

    attackers.forEach((ship: ShipUnit) => {
        let hit = false;
        ship.weapons.forEach((weapon: ShipWeapon) => {
            if(weaponCanFire(weapon)) {
                const target = spaceCombatAttackChooseTarget(combat, ship, weapon);
                if (target) {
                    const oldDmg = target.damage + target.shields;
                    combat = spaceCombatAttackShoot(combat, ship, weapon, target);
                    const newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg) hit = true;
                }
            } else {
                combat.log.push(`RELOADING: ${ship.factionId} ${ship.name} is reloading ${weapon.name}, ${weapon.cooldown + 1} round until ready to fire`);
            }
            


        });
        if (hit) {
            ship.experience++;
        }
    });


    return combat;
}

export function spaceCombatAttackChooseTarget(combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon): ShipUnit | null {
    const target = combat.units.find((su: ShipUnit) => {
        return su.factionId !== attacker.factionId;
    });
    if (target) {
        
        // const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
        //     if(t.factionId !== attacker.factionId) {
        //         const oldHitChance = getHitChance(attacker.factionId, weapon, attacker, t);
        //         const newHitChance = getHitChance(attacker.factionId, weapon, attacker, pos);
        //         const oldDmgPot = damagePotential(weapon, t);
        //         const newDmgPot = damagePotential(weapon, pos);
                
        //         const valueO = oldHitChance + oldDmgPot;
        //         const valueN = newHitChance + newDmgPot;
        //         if(valueO > valueN) {
        //             return t;
        //         } else {
        //             return pos;
        //         }
        //     }
        //     return t;
        // }, target);

        return target;
    }
    combat.done = true;
    return null;
}

export function spaceCombatAttackShoot(combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon, target: ShipUnit): SpaceCombat {

    const attackFaction = getFactionById(attacker.factionId);
    const hitChance = getHitChance(attackFaction, weapon, attacker, target); //50 + weapon.accuracy - target.agility;
    const hitRoll = rnd(1, 100);

    if (hitRoll <= hitChance) {
        const targetFactionUnit = getFactionAdjustedUnit(target);
        const factionWeapon = getFactionAdjustedWeapon(weapon, attackFaction);
        const dmg = (Array.isArray(factionWeapon.damage) ? rnd(factionWeapon.damage[0], factionWeapon.damage[1]) : factionWeapon.damage) - targetFactionUnit.armor;

        if (target.shields > 0) {

            if (target.shields >= dmg) {
                target.shields -= dmg;
            } else {
                target.damage += dmg - target.shields;
                target.shields = 0;
            }
        } else {
            target.damage += dmg;
        }


        combat.log.push(`HIT (${hitRoll} <= ${hitChance}): ${attacker.factionId} ${attacker.name} shoots ${target.name} of ${target.factionId} with ${weapon.name} causing ${dmg} points of hull damage.`);
        combat.units = combat.units.map((su: ShipUnit) => {
            if (su.id === target.id) {
                return target;
            }
            return su;
        })
    } else {
        combat.log.push(`MISS (${hitRoll} > ${hitChance}): ${attacker.factionId} ${attacker.name} misses ${target.name} of ${target.factionId} with ${weapon.name}.`);
    }


    return { ...combat };
}

export function spaceCombatDamageResolve(combat: SpaceCombat): SpaceCombat {
    
    combat.units = combat.units.filter((unit: ShipUnit) => {
        const factionUnit = getFactionAdjustedUnit(unit);
        
        const destroyed = unit.damage >= factionUnit.hull;
        if (destroyed) {
            combat.log.push(`${unit.factionId} ${unit.name} is destroyed with ${unit.damage} / ${factionUnit.hull}!`);
            return false;
        } else {
            combat.log.push(`${unit.factionId} ${unit.name} HULL DAMAGE: ${unit.damage} / ${factionUnit.hull} SHIELDS: ${unit.shields} / ${factionUnit.shieldsMax}`);

        }
        return true;
    });


    return combat;
}

export function spaceCombatMorale(combat: SpaceCombat): SpaceCombat {
    return combat;
}


export function spaceCombatRoundCleanUp(combat: SpaceCombat): SpaceCombat {

    combat.units = combat.units.map((su: ShipUnit) => {
        const factionUnit = getFactionAdjustedUnit(su);
        // Shield Regeneration
        if (factionUnit.shieldsMax > 0) {
            if (su.shields < factionUnit.shieldsMax) {
                su.shields += factionUnit.shieldRegeneration;
                if (su.shields > factionUnit.shieldsMax) {
                    su.shields = factionUnit.shieldsMax;
                }
            }
        }

        return su;
    })

    if (combat.units.length === 0) combat.done = true;
    if (combat.round >= 20) {
        combat.done = true;
    }
    return { ...combat };
}



export function weaponCanFire(weapon: ShipWeapon): boolean {
    // No cool down
    if (weapon.cooldownTime === 0) {
        return true;
    }

    // Weapon is reloading
    if (weapon.cooldown > 0) {
        weapon.cooldown--;
        return false;
    }

    // Fire!
    weapon.cooldown = weapon.cooldownTime;
    return true;
}

export function getHitChance(faction: FactionModel, weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit): number {
    const targetUnit = getFactionAdjustedUnit(target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, faction);
    let chance = 50 + factionWeapon.accuracy - targetUnit.agility;
    return chance;   
}

export function damagePotential(weapon: ShipWeapon, target: ShipUnit, faction: FactionModel): number {
    const targetUnit = getFactionAdjustedUnit(target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, faction);
    const maxDamage = Array.isArray(factionWeapon.damage) ? factionWeapon.damage[1] : factionWeapon.damage;
    const hpleft = targetUnit.hull - target.damage + target.shields ;
    return Math.round((maxDamage / hpleft)*100);
}